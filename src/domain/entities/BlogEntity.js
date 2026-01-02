"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const uuid_1 = require("uuid");
class Blog {
    _id;
    _lawyerId;
    _title;
    _content;
    _coverImage;
    _isPublished;
    _likes;
    _comments;
    _createdAt;
    _updatedAt;
    constructor(props) {
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
    static create(props) {
        const now = new Date();
        return new Blog({
            id: `blog-${(0, uuid_1.v4)()}`,
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
    static fromPersistence(props) {
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
    updateContent(newTitle, newContent, newCoverImage) {
        this._title = newTitle.trim();
        this._content = newContent.trim();
        this._coverImage = newCoverImage ?? this._coverImage;
        this._updatedAt = new Date();
    }
    addComment(userId, comment) {
        this._comments.push({
            userId,
            comment,
            createdAt: new Date(),
        });
        this._updatedAt = new Date();
    }
    like(userId) {
        if (!this._likes.includes(userId)) {
            this._likes.push(userId);
            this._updatedAt = new Date();
        }
    }
    unlike(userId) {
        this._likes = this._likes.filter((id) => id !== userId);
        this._updatedAt = new Date();
    }
    getSummary(maxLength = 150) {
        return this._content.length > maxLength
            ? this._content.substring(0, maxLength) + "..."
            : this._content;
    }
}
exports.Blog = Blog;
