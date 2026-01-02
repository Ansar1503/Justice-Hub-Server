"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletTransaction = void 0;
const uuid_1 = require("uuid");
class WalletTransaction {
    _id;
    _walletId;
    _amount;
    _type;
    _description;
    _category;
    _status;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._walletId = props.walletId;
        this._amount = props.amount;
        this._type = props.type;
        this._description = props.description;
        this._category = props.category;
        this._status = props.status;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    get status() {
        return this._status;
    }
    get id() {
        return this._id;
    }
    get walletId() {
        return this._walletId;
    }
    get amount() {
        return this._amount;
    }
    get type() {
        return this._type;
    }
    get description() {
        return this._description;
    }
    get category() {
        return this._category;
    }
    static create(props) {
        const now = new Date();
        return new WalletTransaction({
            id: `wt-${(0, uuid_1.v4)()}`,
            walletId: props.walletId,
            amount: props.amount,
            type: props.type,
            description: props.description,
            category: props.category,
            status: props.status,
            createdAt: now,
            updatedAt: now,
        });
    }
    static fromPersisted(props) {
        return new WalletTransaction(props);
    }
}
exports.WalletTransaction = WalletTransaction;
