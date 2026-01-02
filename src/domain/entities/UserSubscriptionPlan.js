"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSubscription = void 0;
const uuid_1 = require("uuid");
class UserSubscription {
    _id;
    _userId;
    _planId;
    _stripeSubscriptionId;
    _stripeCustomerId;
    _status;
    _startDate;
    _endDate;
    _autoRenew;
    _benefitsSnapshot;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._userId = props.userId;
        this._planId = props.planId;
        this._stripeSubscriptionId = props.stripeSubscriptionId;
        this._stripeCustomerId = props.stripeCustomerId;
        this._status = props.status;
        this._startDate = props.startDate;
        this._endDate = props.endDate;
        this._autoRenew = props.autoRenew;
        this._benefitsSnapshot = props.benefitsSnapshot;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    static create(props) {
        const now = new Date();
        return new UserSubscription({
            id: `usersub-${(0, uuid_1.v4)()}`,
            userId: props.userId,
            planId: props.planId,
            stripeSubscriptionId: props.stripeSubscriptionId,
            stripeCustomerId: props.stripeCustomerId,
            status: "active",
            startDate: props.startDate,
            endDate: props.endDate,
            autoRenew: props.autoRenew ?? true,
            benefitsSnapshot: props.benefitsSnapshot,
            createdAt: now,
            updatedAt: now,
        });
    }
    static fromPersistence(props) {
        return new UserSubscription(props);
    }
    // Getters
    get id() {
        return this._id;
    }
    get userId() {
        return this._userId;
    }
    get planId() {
        return this._planId;
    }
    get status() {
        return this._status;
    }
    get startDate() {
        return this._startDate;
    }
    get endDate() {
        return this._endDate;
    }
    get benefitsSnapshot() {
        return this._benefitsSnapshot;
    }
    get stripeSubscriptionId() {
        return this._stripeSubscriptionId;
    }
    get stripeCustomerId() {
        return this._stripeCustomerId;
    }
    get autoRenew() {
        return this._autoRenew;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    markExpired() {
        this._status = "expired";
        this._updatedAt = new Date();
    }
    cancel() {
        this._status = "canceled";
        this._autoRenew = false;
        this._updatedAt = new Date();
    }
    setStatus(status) {
        this._status = status;
        this._updatedAt = new Date();
    }
    setCustomerId(id) {
        this._stripeCustomerId = id;
        this._updatedAt = new Date();
    }
    setStripeSubscriptionId(id) {
        this._stripeSubscriptionId = id;
        this._updatedAt = new Date();
    }
    setPlanID(id) {
        this._planId = id;
        this._updatedAt = new Date();
    }
    renew(nextEndDate) {
        this._endDate = nextEndDate;
        this._status = "active";
        this._updatedAt = new Date();
    }
    renewBenefits(benefits) {
        this._benefitsSnapshot = benefits;
    }
    isActive() {
        return this._status === "active";
    }
    isExpired() {
        return this._status === "expired";
    }
}
exports.UserSubscription = UserSubscription;
