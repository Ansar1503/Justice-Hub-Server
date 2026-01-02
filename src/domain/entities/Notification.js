"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const uuid_1 = require("uuid");
class Notification {
    _id;
    _recipientId;
    _senderId;
    _type;
    _roomId;
    _sessionId;
    _title;
    _message;
    _isRead;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._recipientId = props.recipientId;
        this._senderId = props.senderId;
        this._type = props.type;
        this._roomId = props.roomId;
        this._sessionId = props.sessionId;
        this._title = props.title;
        this._message = props.message;
        this._isRead = props.isRead;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    static create(props) {
        const now = new Date();
        return new Notification({
            id: (0, uuid_1.v4)(),
            recipientId: props.recipientId,
            senderId: props.senderId,
            type: props.type,
            roomId: props.roomId,
            sessionId: props.sessionId,
            title: props.title,
            message: props.message,
            isRead: false,
            createdAt: now,
            updatedAt: now,
        });
    }
    static fromPersistence(props) {
        return new Notification(props);
    }
    // Getters
    get id() {
        return this._id;
    }
    get recipientId() {
        return this._recipientId;
    }
    get senderId() {
        return this._senderId;
    }
    get type() {
        return this._type;
    }
    get roomId() {
        return this._roomId;
    }
    get sessionId() {
        return this._sessionId;
    }
    get title() {
        return this._title;
    }
    get message() {
        return this._message;
    }
    get isRead() {
        return this._isRead;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    // methods
    markAsRead() {
        this._isRead = true;
        this.touch();
    }
    updateMessage(newMessage) {
        this._message = newMessage;
        this.touch();
    }
    updateTitle(newTitle) {
        this._title = newTitle;
        this.touch();
    }
    touch() {
        this._updatedAt = new Date();
    }
}
exports.Notification = Notification;
