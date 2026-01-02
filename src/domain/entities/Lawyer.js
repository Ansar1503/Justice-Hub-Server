"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lawyer = void 0;
const uuid_1 = require("uuid");
class Lawyer {
    _id;
    _userId;
    _description;
    _practiceAreas;
    _experience;
    _specializations;
    _consultationFee;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._userId = props.userId;
        this._description = props.description;
        this._practiceAreas = props.practiceAreas;
        this._experience = props.experience;
        this._specializations = props.specializations;
        this._consultationFee = props.consultationFee;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    static create(props) {
        const now = new Date();
        return new Lawyer({
            ...props,
            id: (0, uuid_1.v4)(),
            createdAt: now,
            updatedAt: now,
        });
    }
    static fromPersistence(props) {
        return new Lawyer(props);
    }
    toPersistence() {
        return {
            id: this._id,
            userId: this._userId,
            description: this._description,
            practiceAreas: this._practiceAreas,
            experience: this._experience,
            specializations: this._specializations,
            consultationFee: this._consultationFee,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }
    touch() {
        this._updatedAt = new Date();
    }
    // getters
    get id() {
        return this._id;
    }
    get userId() {
        return this._userId;
    }
    get description() {
        return this._description;
    }
    get practiceAreas() {
        return this._practiceAreas;
    }
    get experience() {
        return this._experience;
    }
    get specializations() {
        return this._specializations;
    }
    get consultationFee() {
        return this._consultationFee;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    // update methods
    updateDescription(newDescription) {
        this._description = newDescription;
        this.touch();
    }
    updatePracticeAreas(newAreas) {
        this._practiceAreas = newAreas;
        this.touch();
    }
    updateSpecializations(newSpecializations) {
        this._specializations = newSpecializations;
        this.touch();
    }
    updateExperience(newExperience) {
        this._experience = newExperience;
        this.touch();
    }
    updateConsultationFee(newFee) {
        this._consultationFee = newFee;
        this.touch();
    }
    update(payload) {
        let changed = false;
        if (payload.description !== undefined) {
            this._description = payload.description;
            changed = true;
        }
        if (payload.practiceAreas !== undefined) {
            this._practiceAreas = payload.practiceAreas;
            changed = true;
        }
        if (payload.specializations !== undefined) {
            this._specializations = payload.specializations;
            changed = true;
        }
        if (payload.experience !== undefined) {
            this._experience = payload.experience;
            changed = true;
        }
        if (payload.consultationFee !== undefined) {
            this._consultationFee = payload.consultationFee;
            changed = true;
        }
        if (changed)
            this.touch();
    }
}
exports.Lawyer = Lawyer;
