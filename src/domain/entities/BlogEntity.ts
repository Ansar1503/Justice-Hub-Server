import { v4 as uuidv4 } from "uuid";

export interface BlogComment {
  userId: string;
  comment: string;
  createdAt: Date;
}

export interface CreateBlogProps {
  lawyerId: string;
  title: string;
  content: string;
  coverImage?: string;
  isPublished?: boolean;
}

export interface PersistedBlogProps {
  id: string;
  lawyerId: string;
  title: string;
  content: string;
  coverImage?: string;
  isPublished: boolean;
  likes: string[];
  comments: BlogComment[];
  createdAt: Date;
  updatedAt: Date;
}

export class Blog {
  private _id: string;
  private _lawyerId: string;
  private _title: string;
  private _content: string;
  private _coverImage?: string;
  private _isPublished: boolean;
  private _likes: string[];
  private _comments: BlogComment[];
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: PersistedBlogProps) {
    this._id = props.id;
    this._lawyerId = props.lawyerId;
    this._title = props.title;
    this._content = props.content;
    this._coverImage = props.coverImage;
    this._isPublished = props.isPublished;
    this._likes = props.likes;
    this._comments = props.comments;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: CreateBlogProps): Blog {
    const now = new Date();
    return new Blog({
      id: `blog-${uuidv4()}`,
      lawyerId: props.lawyerId,
      title: props.title.trim(),
      content: props.content.trim(),
      coverImage: props.coverImage,
      isPublished: props.isPublished ?? false,
      likes: [],
      comments: [],
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: PersistedBlogProps): Blog {
    return new Blog(props);
  }

  get id() {
    return this._id;
  }

  get lawyerId() {
    return this._lawyerId;
  }

  get title() {
    return this._title;
  }

  get content() {
    return this._content;
  }

  get coverImage() {
    return this._coverImage;
  }

  get isPublished() {
    return this._isPublished;
  }

  get likes() {
    return this._likes;
  }

  get comments() {
    return this._comments;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  publish() {
    this._isPublished = true;
    this._updatedAt = new Date();
  }

  unpublish() {
    this._isPublished = false;
    this._updatedAt = new Date();
  }

  updateContent(newTitle: string, newContent: string, newCoverImage?: string) {
    this._title = newTitle.trim();
    this._content = newContent.trim();
    this._coverImage = newCoverImage ?? this._coverImage;
    this._updatedAt = new Date();
  }

  addComment(userId: string, comment: string) {
    this._comments.push({
      userId,
      comment,
      createdAt: new Date(),
    });
    this._updatedAt = new Date();
  }

  like(userId: string) {
    if (!this._likes.includes(userId)) {
      this._likes.push(userId);
      this._updatedAt = new Date();
    }
  }

  unlike(userId: string) {
    this._likes = this._likes.filter((id) => id !== userId);
    this._updatedAt = new Date();
  }

  getSummary(maxLength = 150): string {
    return this._content.length > maxLength
      ? this._content.substring(0, maxLength) + "..."
      : this._content;
  }
}
