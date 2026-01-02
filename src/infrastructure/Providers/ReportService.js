"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
class ReportService {
    generators;
    constructor() {
        this.generators = new Map();
    }
    register(format, generator) {
        this.generators.set(format.toLowerCase(), generator);
    }
    get(format) {
        const generator = this.generators.get(format.toLowerCase());
        if (!generator) {
            throw new Error(`Unsupported report format: ${format}`);
        }
        return generator;
    }
    has(format) {
        return this.generators.has(format.toLowerCase());
    }
}
exports.ReportService = ReportService;
