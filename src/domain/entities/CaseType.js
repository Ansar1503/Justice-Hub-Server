"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseType = void 0;
const uuid_1 = require("uuid");
class CaseType {
    _id;
    _name;
    _practiceareaId;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._name = props.name;
        this._practiceareaId = props.practiceareaId;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get practiceareaId() {
        return this._practiceareaId;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    static create(props) {
        const now = new Date();
        return new CaseType({
            id: `ct-${(0, uuid_1.v4)()}`,
            name: props.name,
            practiceareaId: props.practiceareaId,
            createdAt: now,
            updatedAt: now,
        });
    }
    static fromPersistance(props) {
        return new CaseType(props);
    }
    updateName(name) {
        this._name = name;
        this._updatedAt = new Date();
    }
    updatePracticeareaId(id) {
        this._practiceareaId = id;
        this._updatedAt = new Date();
    }
}
exports.CaseType = CaseType;
