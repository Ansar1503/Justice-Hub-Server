"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PracticeArea = void 0;
const uuid_1 = require("uuid");
class PracticeArea {
    _id;
    _name;
    _specializationId;
    _createdAt;
    _udpatedAt;
    constructor(props) {
        this._id = props.id;
        this._name = props.name;
        this._specializationId = props.specializationId;
        this._createdAt = props.createdAt;
        this._udpatedAt = props.updatedAt;
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get specializationId() {
        return this._specializationId;
    }
    get createdAt() {
        return this._createdAt;
    }
    get udpatedAt() {
        return this._udpatedAt;
    }
    static create(props) {
        const now = new Date();
        return new PracticeArea({
            id: `pr-${(0, uuid_1.v4)()}`,
            name: props.name,
            specializationId: props.specializationId,
            createdAt: now,
            updatedAt: now,
        });
    }
    static fromPersisted(props) {
        return new PracticeArea(props);
    }
    updateName(name) {
        this._name = name;
        this._udpatedAt = new Date();
    }
    updateSpecialisation(id) {
        this._specializationId = id;
        this._udpatedAt = new Date();
    }
}
exports.PracticeArea = PracticeArea;
