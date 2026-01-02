"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Availability = void 0;
const uuid_1 = require("uuid");
class Availability {
    _id;
    _lawyer_id;
    _monday;
    _tuesday;
    _wednesday;
    _thursday;
    _friday;
    _saturday;
    _sunday;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._lawyer_id = props.lawyer_id;
        this._monday = props.monday;
        this._tuesday = props.tuesday;
        this._wednesday = props.wednesday;
        this._thursday = props.thursday;
        this._friday = props.friday;
        this._saturday = props.saturday;
        this._sunday = props.sunday;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    static create(defaultSlots) {
        function setDefaultDay(day) {
            return {
                enabled: day !== "saturday" && day !== "sunday",
                timeSlots: [{ start: "09:00", end: "17:00" }],
            };
        }
        const now = new Date();
        const defaultAvailability = {
            id: `avb-${(0, uuid_1.v4)()}`,
            lawyer_id: defaultSlots?.lawyer_id || "",
            monday: defaultSlots?.monday || setDefaultDay("monday"),
            tuesday: defaultSlots?.tuesday || setDefaultDay("tuesday"),
            wednesday: defaultSlots?.wednesday || setDefaultDay("wednesday"),
            thursday: defaultSlots?.thursday || setDefaultDay("thursday"),
            friday: defaultSlots?.friday || setDefaultDay("friday"),
            saturday: defaultSlots?.saturday || setDefaultDay("saturday"),
            sunday: defaultSlots?.sunday || setDefaultDay("sunday"),
            createdAt: defaultSlots?.createdAt || now,
            updatedAt: defaultSlots?.updatedAt || now,
        };
        return new Availability(defaultAvailability);
    }
    static fromPersistence(availability) {
        return new Availability(availability);
    }
    get id() {
        return this._id;
    }
    get lawyer_id() {
        return this._lawyer_id;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    getDayAvailability(day) {
        return this[`_${day}`];
    }
    enableDay(day) {
        this[`_${day}`].enabled = true;
    }
    disableDay(day) {
        this[`_${day}`].enabled = false;
        this[`_${day}`].timeSlots = [];
    }
    addTimeSlot(day, slot) {
        this[`_${day}`].timeSlots.push(slot);
    }
    removeTimeSlot(day, index) {
        this[`_${day}`].timeSlots.splice(index, 1);
    }
    clearTimeSlots(day) {
        this[`_${day}`].timeSlots = [];
    }
    updateTimeSlots(day, slots) {
        this[`_${day}`].timeSlots = slots;
    }
}
exports.Availability = Availability;
