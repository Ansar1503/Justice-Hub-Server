"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSession = void 0;
const uuid_1 = require("uuid");
class ChatSession {
    _id;
    _name;
    _participants;
    _last_message;
    _session_id;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._name = props.name;
        this._participants = props.participants;
        this._last_message = props.last_message;
        this._session_id = props.session_id;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    static create(props) {
        const now = new Date();
        return new ChatSession({
            id: `cs-${(0, uuid_1.v4)()}`,
            name: props.name,
            participants: props.participants,
            last_message: props.last_message,
            session_id: props.session_id,
            createdAt: now,
            updatedAt: now,
        });
    }
    static fromPersistence(props) {
        return new ChatSession(props);
    }
    // getters
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get participants() {
        return this._participants;
    }
    get lastMessage() {
        return this._last_message;
    }
    get sessionId() {
        return this._session_id;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    // methods
    updateLastMessage(message) {
        this._last_message = message;
        this.touch();
    }
    renameSession(newName) {
        this._name = newName;
        this.touch();
    }
    touch() {
        this._updatedAt = new Date();
    }
}
exports.ChatSession = ChatSession;
