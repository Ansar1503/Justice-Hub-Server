"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Case = void 0;
const uuid_1 = require("uuid");
class Case {
    _id;
    _title;
    _clientId;
    _lawyerId;
    _caseType;
    _summary;
    _status;
    _estimatedValue;
    _nextHearing;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._title = props.title;
        this._clientId = props.clientId;
        this._lawyerId = props.lawyerId;
        this._caseType = props.caseType;
        this._summary = props.summary;
        this._estimatedValue = props.estimatedValue;
        this._nextHearing = props.nextHearing;
        this._status = props.status;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    static create(props) {
        const now = new Date();
        return new Case({
            id: `case-${(0, uuid_1.v4)()}`,
            title: props.title,
            clientId: props.clientId,
            lawyerId: props.lawyerId,
            caseType: props.caseType,
            summary: props.summary,
            status: "open",
            createdAt: now,
            updatedAt: now,
        });
    }
    static fromPersistance(props) {
        return new Case(props);
    }
    get id() {
        return this._id;
    }
    get estimatedValue() {
        return this._estimatedValue;
    }
    get nextHearing() {
        return this._nextHearing;
    }
    get status() {
        return this._status;
    }
    get title() {
        return this._title;
    }
    get clientId() {
        return this._clientId;
    }
    get lawyerId() {
        return this._lawyerId;
    }
    get caseType() {
        return this._caseType;
    }
    get summary() {
        return this._summary;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    updateSummary(summary) {
        this._summary = summary;
        this._updatedAt = new Date();
    }
    putOnHold() {
        this._status = "onhold";
        this._updatedAt = new Date();
    }
    reopenCase() {
        if (this._status === "closed") {
            this._status = "open";
            this._updatedAt = new Date();
        }
    }
    closeCase() {
        this._status = "closed";
        this._updatedAt = new Date();
    }
}
exports.Case = Case;
