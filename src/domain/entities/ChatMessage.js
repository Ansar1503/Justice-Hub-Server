"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessage = void 0;
const uuid_1 = require("uuid");
class ChatMessage {
    _id;
    _session_id;
    _senderId;
    _receiverId;
    _content;
    _read;
    _active;
    _attachments;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._session_id = props.session_id;
        this._senderId = props.senderId;
        this._receiverId = props.receiverId;
        this._content = props.content;
        this._read = props.read;
        this._active = props.active;
        this._attachments = props.attachments;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    static create(props) {
        const now = new Date();
        return new ChatMessage({
            id: `cm-${(0, uuid_1.v4)()}`,
            session_id: props.session_id,
            senderId: props.senderId,
            receiverId: props.receiverId,
            content: props.content,
            read: false,
            active: true,
            attachments: props.attachments,
            createdAt: now,
            updatedAt: now,
        });
    }
    static fromPersistence(props) {
        return new ChatMessage(props);
    }
    // Getters
    get id() {
        return this._id;
    }
    get sessionId() {
        return this._session_id;
    }
    get senderId() {
        return this._senderId;
    }
    get receiverId() {
        return this._receiverId;
    }
    get content() {
        return this._content;
    }
    get read() {
        return this._read;
    }
    get active() {
        return this._active;
    }
    get attachments() {
        return this._attachments;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    //   Methods
    markAsRead() {
        this._read = true;
        this.touch();
    }
    deleteMessage() {
        this._active = false;
        this.touch();
    }
    updateContent(newContent) {
        this._content = newContent;
        this.touch();
    }
    addAttachment(attachment) {
        if (!this._attachments) {
            this._attachments = [];
        }
        this._attachments.push(attachment);
        this.touch();
    }
    touch() {
        this._updatedAt = new Date();
    }
}
exports.ChatMessage = ChatMessage;
