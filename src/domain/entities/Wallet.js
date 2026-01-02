"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const uuid_1 = require("uuid");
class Wallet {
    _id;
    _user_id;
    _balance;
    _status;
    _isAdmin;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._user_id = props.user_id;
        this._balance = props.balance;
        this._status = props.status;
        this._isAdmin = props.isAdmin;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    static create(props) {
        const now = new Date();
        return new Wallet({
            balance: 0,
            status: true,
            createdAt: now,
            updatedAt: now,
            isAdmin: false,
            user_id: props.user_id,
            id: `w-${(0, uuid_1.v4)()}`,
        });
    }
    static fromPersisted(props) {
        return new Wallet(props);
    }
    get id() {
        return this._id;
    }
    get user_id() {
        return this._user_id;
    }
    get balance() {
        return this._balance;
    }
    get status() {
        return this._status;
    }
    get isAdmin() {
        return this._isAdmin;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    updateStatus(status) {
        this._status = status;
        this._updatedAt = new Date();
    }
    updateBalance(balance) {
        this._balance = balance;
        this._updatedAt = new Date();
    }
}
exports.Wallet = Wallet;
