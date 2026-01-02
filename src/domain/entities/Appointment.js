"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
const uuid_1 = require("uuid");
class Appointment {
    _id;
    _lawyer_id;
    _client_id;
    _bookingId;
    _caseId;
    _date;
    _time;
    _duration;
    _reason;
    _amount;
    _payment_status;
    _type;
    _status;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._bookingId = props.bookingId;
        this._lawyer_id = props.lawyer_id;
        this._client_id = props.client_id;
        this._caseId = props.caseId;
        this._date = props.date;
        this._time = props.time;
        this._duration = props.duration;
        this._reason = props.reason;
        this._amount = props.amount;
        this._payment_status = props.payment_status;
        this._type = props.type;
        this._status = props.status;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    static create(props) {
        const now = new Date();
        return new Appointment({
            id: `amt-${(0, uuid_1.v4)()}`,
            lawyer_id: props.lawyer_id,
            client_id: props.client_id,
            caseId: props.caseId,
            date: props.date,
            time: props.time,
            duration: props.duration,
            reason: props.reason,
            amount: props.amount,
            bookingId: `BK-${(0, uuid_1.v4)().split("-")[0].toUpperCase()}`,
            payment_status: props.payment_status,
            type: props.type,
            status: "pending",
            createdAt: now,
            updatedAt: now,
        });
    }
    static fromPersistence(props) {
        return new Appointment(props);
    }
    get id() {
        return this._id;
    }
    get bookingId() {
        return this._bookingId;
    }
    get caseId() {
        return this._caseId;
    }
    get lawyer_id() {
        return this._lawyer_id;
    }
    get client_id() {
        return this._client_id;
    }
    get date() {
        return this._date;
    }
    get time() {
        return this._time;
    }
    get duration() {
        return this._duration;
    }
    get reason() {
        return this._reason;
    }
    get amount() {
        return this._amount;
    }
    get payment_status() {
        return this._payment_status;
    }
    get type() {
        return this._type;
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
    confirm() {
        this._status = "confirmed";
        this.touch();
    }
    complete() {
        this._status = "completed";
        this.touch();
    }
    cancel() {
        this._status = "cancelled";
        this.touch();
    }
    reject() {
        this._status = "rejected";
        this.touch();
    }
    markPaymentSuccess() {
        this._payment_status = "success";
        this.touch();
    }
    markPaymentFailed() {
        this._payment_status = "failed";
        this.touch();
    }
    updateReason(newReason) {
        this._reason = newReason;
        this.touch();
    }
    touch() {
        this._updatedAt = new Date();
    }
}
exports.Appointment = Appointment;
