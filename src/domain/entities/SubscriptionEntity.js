"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPlan = void 0;
const uuid_1 = require("uuid");
class SubscriptionPlan {
    _id;
    _name;
    _description;
    _price;
    _interval;
    _stripeProductId;
    _stripePriceId;
    _isFree;
    _isActive;
    _benefits;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._name = props.name;
        this._description = props.description;
        this._price = props.price;
        this._interval = props.interval;
        this._stripeProductId = props.stripeProductId;
        this._stripePriceId = props.stripePriceId;
        this._isFree = props.isFree;
        this._isActive = props.isActive;
        this._benefits = props.benefits;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    static create(props) {
        const now = new Date();
        return new SubscriptionPlan({
            id: `plan-${(0, uuid_1.v4)()}`,
            name: props.name,
            description: props.description,
            price: props.price,
            interval: props.interval,
            stripeProductId: props.stripeProductId,
            stripePriceId: props.stripePriceId,
            isFree: props.isFree ?? false,
            isActive: true,
            benefits: props.benefits,
            createdAt: now,
            updatedAt: now,
        });
    }
    static fromPersistence(props) {
        return new SubscriptionPlan(props);
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get description() {
        return this._description;
    }
    get price() {
        return this._price;
    }
    get interval() {
        return this._interval;
    }
    get stripeProductId() {
        return this._stripeProductId;
    }
    get stripePriceId() {
        return this._stripePriceId;
    }
    get isFree() {
        return this._isFree;
    }
    get isActive() {
        return this._isActive;
    }
    get benefits() {
        return this._benefits;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    deactivate() {
        this._isActive = false;
        this._updatedAt = new Date();
    }
    activate() {
        this._isActive = true;
        this._updatedAt = new Date();
    }
    updateBenefits(newBenefits) {
        this._benefits = { ...this._benefits, ...newBenefits };
        this._updatedAt = new Date();
    }
    updatePrice(newPrice) {
        this._price = newPrice;
        this._updatedAt = new Date();
    }
    isRecurring() {
        return this._interval !== "none";
    }
    hasChatAccess() {
        return this._benefits.chatAccess;
    }
    hasUnlimitedBookings() {
        return this._benefits.bookingsPerMonth === "unlimited";
    }
}
exports.SubscriptionPlan = SubscriptionPlan;
