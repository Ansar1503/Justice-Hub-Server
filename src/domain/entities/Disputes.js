"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Disputes = void 0;
class Disputes {
    _id;
    _disputeType;
    _contentId;
    _reportedBy;
    _reportedUser;
    _reason;
    _status;
    _resolveAction;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._disputeType = props.disputeType;
        this._contentId = props.contentId;
        this._reportedBy = props.reportedBy;
        this._reportedUser = props.reportedUser;
        this._reason = props.reason;
        this._status = props.status;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
        this._resolveAction = props.resolveAction;
    }
    static create(props) {
        const now = new Date();
        return new Disputes({
            id: `dspt-${crypto.randomUUID()}`,
            ...props,
            status: props.status || "pending",
            createdAt: now,
            updatedAt: now,
        });
    }
    static fromPersistence(props) {
        return new Disputes(props);
    }
    // Getters
    get id() {
        return this._id;
    }
    get disputeType() {
        return this._disputeType;
    }
    get contentId() {
        return this._contentId;
    }
    get reportedBy() {
        return this._reportedBy;
    }
    get resolveAction() {
        return this._resolveAction;
    }
    get reportedUser() {
        return this._reportedUser;
    }
    get reason() {
        return this._reason;
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
    updateStatus(status) {
        this._status = status;
        this.touch();
    }
    updateAction(action) {
        this._resolveAction = action;
        this.touch();
    }
    updateReason(reason) {
        this._reason = reason;
        this.touch();
    }
    touch() {
        this._updatedAt = new Date();
    }
}
exports.Disputes = Disputes;
