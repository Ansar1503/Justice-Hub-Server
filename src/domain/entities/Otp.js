"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Otp = void 0;
const uuid_1 = require("uuid");
class Otp {
    _id;
    _email;
    _otp;
    _expiresAt;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._email = props.email;
        this._otp = props.otp;
        this._expiresAt = props.expiresAt;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    static create(props) {
        const expiresAt = new Date(Date.now() + 60 * 1000);
        const now = new Date();
        return new Otp({
            id: `otp-${(0, uuid_1.v4)()}`,
            email: props.email,
            otp: props.otp,
            expiresAt,
            createdAt: now,
            updatedAt: now,
        });
    }
    static fromPersistence(props) {
        return new Otp(props);
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
    get email() {
        return this._email;
    }
    get otp() {
        return this._otp;
    }
    get expiresAt() {
        return this._expiresAt;
    }
    isExpired() {
        return new Date() > this._expiresAt;
    }
}
exports.Otp = Otp;
