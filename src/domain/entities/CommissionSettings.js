"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionSettings = void 0;
const uuid_1 = require("uuid");
class CommissionSettings {
    _id;
    _initialCommission;
    _followupCommission;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._initialCommission = props.initialCommission;
        this._followupCommission = props.followupCommission;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    static create(props) {
        const now = new Date();
        return new CommissionSettings({
            id: `commission-settings-${(0, uuid_1.v4)()}`,
            initialCommission: props.initialCommission,
            followupCommission: props.followupCommission,
            createdAt: now,
            updatedAt: now,
        });
    }
    static fromPersistence(props) {
        return new CommissionSettings(props);
    }
    get id() {
        return this._id;
    }
    get initialCommission() {
        return this._initialCommission;
    }
    get followupCommission() {
        return this._followupCommission;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    updateCommissions(initialCommission, followupCommission) {
        this._initialCommission = initialCommission;
        this._followupCommission = followupCommission;
        this._updatedAt = new Date();
    }
}
exports.CommissionSettings = CommissionSettings;
