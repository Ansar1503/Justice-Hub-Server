"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallLogs = void 0;
class CallLogs {
    _id;
    _roomId;
    _session_id;
    _start_time;
    _end_time;
    _client_joined_at;
    _client_left_at;
    _lawyer_joined_at;
    _lawyer_left_at;
    _callDuration;
    _status;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._roomId = props.roomId;
        this._session_id = props.session_id;
        this._start_time = props.start_time;
        this._end_time = props.end_time;
        this._client_joined_at = props.client_joined_at;
        this._client_left_at = props.client_left_at;
        this._lawyer_joined_at = props.lawyer_joined_at;
        this._lawyer_left_at = props.lawyer_left_at;
        this._callDuration = props.callDuration;
        this._status = props.status;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    static create(props) {
        const now = new Date();
        return new CallLogs({
            id: `clg-${crypto.randomUUID()}`,
            roomId: props.roomId,
            session_id: props.session_id,
            start_time: props.start_time ?? now,
            end_time: props.end_time,
            client_joined_at: props.client_joined_at,
            client_left_at: props.client_left_at,
            lawyer_joined_at: props.lawyer_joined_at,
            lawyer_left_at: props.lawyer_left_at,
            callDuration: props.callDuration,
            status: props.status,
            createdAt: now,
            updatedAt: now,
        });
    }
    static fromPersistence(props) {
        return new CallLogs(props);
    }
    // Getters
    get id() {
        return this._id;
    }
    get roomId() {
        return this._roomId;
    }
    get session_id() {
        return this._session_id;
    }
    get start_time() {
        return this._start_time;
    }
    get end_time() {
        return this._end_time;
    }
    get client_joined_at() {
        return this._client_joined_at;
    }
    get client_left_at() {
        return this._client_left_at;
    }
    get lawyer_joined_at() {
        return this._lawyer_joined_at;
    }
    get lawyer_left_at() {
        return this._lawyer_left_at;
    }
    get callDuration() {
        return this._callDuration;
    }
    get status() {
        return this._status;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    // Methods
    updateStatus(status) {
        this._status = status;
        this.touch();
    }
    updateCallTimes(props) {
        let changed = false;
        if (props.start_time !== undefined) {
            this._start_time = props.start_time;
            changed = true;
        }
        if (props.end_time !== undefined) {
            this._end_time = props.end_time;
            changed = true;
        }
        if (props.client_joined_at !== undefined) {
            this._client_joined_at = props.client_joined_at;
            changed = true;
        }
        if (props.client_left_at !== undefined) {
            this._client_left_at = props.client_left_at;
            changed = true;
        }
        if (props.lawyer_joined_at !== undefined) {
            this._lawyer_joined_at = props.lawyer_joined_at;
            changed = true;
        }
        if (props.lawyer_left_at !== undefined) {
            this._lawyer_left_at = props.lawyer_left_at;
            changed = true;
        }
        if (props.callDuration !== undefined) {
            this._callDuration = props.callDuration;
            changed = true;
        }
        if (changed) {
            this.touch();
        }
    }
    touch() {
        this._updatedAt = new Date();
    }
}
exports.CallLogs = CallLogs;
