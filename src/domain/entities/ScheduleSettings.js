"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleSettings = void 0;
const uuid_1 = require("uuid");
class ScheduleSettings {
    _id;
    _lawyer_id;
    _slotDuration;
    _maxDaysInAdvance;
    _autoConfirm;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._lawyer_id = props.lawyer_id;
        this._slotDuration = props.slotDuration;
        this._maxDaysInAdvance = props.maxDaysInAdvance;
        this._autoConfirm = props.autoConfirm;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    static create(props) {
        const now = new Date();
        return new ScheduleSettings({
            id: (0, uuid_1.v4)(),
            lawyer_id: props.lawyer_id,
            slotDuration: props.slotDuration,
            maxDaysInAdvance: props.maxDaysInAdvance,
            autoConfirm: props.autoConfirm,
            createdAt: now,
            updatedAt: now,
        });
    }
    static fromPersistence(props) {
        return new ScheduleSettings(props);
    }
    // Getters
    get id() {
        return this._id;
    }
    get lawyerId() {
        return this._lawyer_id;
    }
    get slotDuration() {
        return this._slotDuration;
    }
    get maxDaysInAdvance() {
        return this._maxDaysInAdvance;
    }
    get autoConfirm() {
        return this._autoConfirm;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    updateSettings(slotDuration, maxDaysInAdvance, autoConfirm) {
        this._slotDuration = slotDuration;
        this._maxDaysInAdvance = maxDaysInAdvance;
        this._autoConfirm = autoConfirm;
        this.touch();
    }
    touch() {
        this._updatedAt = new Date();
    }
}
exports.ScheduleSettings = ScheduleSettings;
