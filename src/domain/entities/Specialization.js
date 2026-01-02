"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Specialization = void 0;
const uuid_1 = require("uuid");
class Specialization {
    _id;
    _name;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._name = props.name;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    static create(props) {
        const now = new Date();
        return new Specialization({
            id: `sp-${(0, uuid_1.v4)()}`,
            name: props.name,
            createdAt: now,
            updatedAt: now,
        });
    }
    static fromPersisted(props) {
        return new Specialization(props);
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    updateName(name) {
        this._name = name;
        this._updatedAt = new Date();
    }
}
exports.Specialization = Specialization;
