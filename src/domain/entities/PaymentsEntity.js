"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const uuid_1 = require("uuid");
class Payment {
    _id;
    _clientId;
    _paidFor;
    _referenceId;
    _amount;
    _currency;
    _status;
    _provider;
    _providerRefId;
    _createdAt;
    constructor(props) {
        this._id = props.id;
        this._clientId = props.clientId;
        this._paidFor = props.paidFor;
        this._referenceId = props.referenceId;
        this._amount = props.amount;
        this._currency = props.currency;
        this._status = props.status;
        this._provider = props.provider;
        this._providerRefId = props.providerRefId;
        this._createdAt = props.createdAt;
    }
    static create(props) {
        return new Payment({
            id: `payment-${(0, uuid_1.v4)()}`,
            clientId: props.clientId,
            paidFor: props.paidFor,
            referenceId: props.referenceId,
            amount: props.amount,
            currency: props.currency,
            status: "paid",
            provider: props.provider,
            providerRefId: props.providerRefId,
            createdAt: new Date(),
        });
    }
    static fromPersistence(props) {
        return new Payment(props);
    }
    get id() {
        return this._id;
    }
    get clientId() {
        return this._clientId;
    }
    get paidFor() {
        return this._paidFor;
    }
    get referenceId() {
        return this._referenceId;
    }
    get amount() {
        return this._amount;
    }
    get currency() {
        return this._currency;
    }
    get status() {
        return this._status;
    }
    get provider() {
        return this._provider;
    }
    get providerRefId() {
        return this._providerRefId;
    }
    get createdAt() {
        return this._createdAt;
    }
    updateStatus(status) {
        this._status = status;
    }
    refund() {
        if (this._status !== "paid") {
            throw new Error("Only paid payments can be refunded");
        }
        this._status = "refunded";
    }
}
exports.Payment = Payment;
