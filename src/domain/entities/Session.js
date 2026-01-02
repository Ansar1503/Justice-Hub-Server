"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const uuid_1 = require("uuid");
class Session {
    _id;
    _appointment_id;
    _lawyer_id;
    _client_id;
    _caseId;
    _bookingId;
    _status;
    _notes;
    _summary;
    _follow_up_suggested;
    _follow_up_session_id;
    _room_id;
    _start_time;
    _end_time;
    _client_joined_at;
    _client_left_at;
    _lawyer_joined_at;
    _lawyer_left_at;
    _end_reason;
    _callDuration;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._appointment_id = props.appointment_id;
        this._lawyer_id = props.lawyer_id;
        this._client_id = props.client_id;
        this._caseId = props.caseId;
        this._status = props.status;
        this._bookingId = props.bookingId;
        this._notes = props.notes;
        this._summary = props.summary;
        this._follow_up_suggested = props.follow_up_suggested;
        this._follow_up_session_id = props.follow_up_session_id;
        this._room_id = props.room_id;
        this._start_time = props.start_time;
        this._end_time = props.end_time;
        this._client_joined_at = props.client_joined_at;
        this._client_left_at = props.client_left_at;
        this._lawyer_joined_at = props.lawyer_joined_at;
        this._lawyer_left_at = props.lawyer_left_at;
        this._end_reason = props.end_reason;
        this._callDuration = props.callDuration;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    static create(props) {
        const now = new Date();
        return new Session({
            id: (0, uuid_1.v4)(),
            ...props,
            bookingId: props.bookingId,
            createdAt: now,
            updatedAt: now,
        });
    }
    static fromPersistence(props) {
        return new Session(props);
    }
    // Getters
    get id() {
        return this._id;
    }
    get caseId() {
        return this._caseId;
    }
    get bookingId() {
        return this._bookingId;
    }
    get appointment_id() {
        return this._appointment_id;
    }
    get lawyer_id() {
        return this._lawyer_id;
    }
    get client_id() {
        return this._client_id;
    }
    get status() {
        return this._status;
    }
    get notes() {
        return this._notes;
    }
    get summary() {
        return this._summary;
    }
    get follow_up_suggested() {
        return this._follow_up_suggested;
    }
    get follow_up_session_id() {
        return this._follow_up_session_id;
    }
    get room_id() {
        return this._room_id;
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
    get end_reason() {
        return this._end_reason;
    }
    get callDuration() {
        return this._callDuration;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    //methosd
    updateStatus(status) {
        this._status = status;
        this.touch();
    }
    setStartTime(time) {
        this._start_time = time;
        this.touch();
    }
    setEndTime(time) {
        this._end_time = time;
        this.touch();
    }
    recordCallDuration() {
        if (this._start_time && this._end_time) {
            this._callDuration = Math.floor((this._end_time.getTime() - this._start_time.getTime()) / 1000);
            this.touch();
        }
    }
    updateNotesAndSummary(notes, summary) {
        this._notes = notes;
        this._summary = summary;
        this.touch();
    }
    touch() {
        this._updatedAt = new Date();
    }
}
exports.Session = Session;
