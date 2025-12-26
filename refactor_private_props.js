const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
  let files = [];
  try {
    files = fs.readdirSync(dirPath);
  } catch (err) {
    console.error(`Error reading ${dirPath}: ${err.message}`);
    return arrayOfFiles || [];
  }

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    const fullPath = path.join(dirPath, file);
    try {
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            if (file.endsWith('.ts')) {
                arrayOfFiles.push(fullPath);
            }
        }
    } catch (err) {
        console.error(`Error processing ${fullPath}: ${err.message}`);
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles('src');
console.log(`Found ${files.length} ts files.`);
let totalModified = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // Regex to find candidates: "private name" or "private readonly name"
  // Match "private" followed by space(s), optionally "readonly" and space(s), then the identifier.
  const regex = /private\s+(?:readonly\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
  
  let match;
  const propsToRename = new Set();
  
  while ((match = regex.exec(content)) !== null) {
      const fullMatch = match[0];
      const name = match[1];
      const index = match.index;
      const end = index + fullMatch.length;
      
      // Check what follows
      const after = content.slice(end);
      // Skip if it looks like a method: optional space, then '('
      if (/^\s*\(/.test(after)) {
          continue; 
      }
      
      // Skip if already starts with _
      if (name.startsWith('_')) {
          continue;
      }
      
      propsToRename.add(name);
  }
  
  if (propsToRename.size > 0) {
      let tempContent = content;
      propsToRename.forEach(name => {
          // 1. Rename declarations
          // Pattern: (private\s+(?:readonly\s+)?)name\b
          // Avoid renaming if followed by (
          const declRegex = new RegExp(`(private\\s+(?:readonly\\s+)?)(${name})\\b`, 'g');
          tempContent = tempContent.replace(declRegex, (m, prefix, n, offset, str) => {
              const after = str.slice(offset + m.length);
              if (/^\s*\(/.test(after)) return m; 
              return `${prefix}_${n}`;
          });
          
          // 2. Rename usages: this.name -> this._name
          // We check `this.name` not followed by word char.
          const usageRegex = new RegExp(`(this\\.)(${name})\\b`, 'g');
          tempContent = tempContent.replace(usageRegex, `$1_$2`);
      });
      
      if (tempContent !== originalContent) {
          fs.writeFileSync(file, tempContent, 'utf8');
          console.log(`Modified: ${file}`);
          totalModified++;
      }
  }
});

console.log(`Total files modified: ${totalModified}`);
