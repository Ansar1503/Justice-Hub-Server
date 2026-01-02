"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Override = void 0;
const uuid_1 = require("uuid");
class Override {
    _id;
    _lawyer_id;
    _overrideDates;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._lawyer_id = props.lawyer_id;
        this._overrideDates = props.overrideDates;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    static create(props) {
        const now = new Date();
        return new Override({
            id: (0, uuid_1.v4)(),
            lawyer_id: props.lawyer_id,
            overrideDates: props.overrideDates,
            createdAt: now,
            updatedAt: now,
        });
    }
    static fromPersistence(props) {
        return new Override(props);
    }
    // Getters
    get id() {
        return this._id;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    get lawyerId() {
        return this._lawyer_id;
    }
    get overrideDates() {
        return this._overrideDates;
    }
    //  Methods
    updateOverrideDates(newDates) {
        this._overrideDates = newDates;
    }
    addOverrideDate(date) {
        this._overrideDates.push(date);
    }
    removeOverrideDate(dateToRemove) {
        this._overrideDates = this._overrideDates.filter((entry) => entry.date.getTime() !== dateToRemove.getTime());
    }
}
exports.Override = Override;
