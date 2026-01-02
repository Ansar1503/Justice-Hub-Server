"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionTransaction = void 0;
const uuid_1 = require("uuid");
class CommissionTransaction {
    _id;
    _bookingId;
    _clientId;
    _lawyerId;
    _baseFee;
    _subscriptionDiscount;
    _followupDiscount;
    _amountPaid;
    _commissionPercent;
    _commissionAmount;
    _lawyerAmount;
    _type;
    _status;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._bookingId = props.bookingId;
        this._clientId = props.clientId;
        this._lawyerId = props.lawyerId;
        this._baseFee = props.baseFee;
        this._subscriptionDiscount = props.subscriptionDiscount;
        this._followupDiscount = props.followupDiscount;
        this._amountPaid = props.amountPaid;
        this._commissionPercent = props.commissionPercent;
        this._commissionAmount = props.commissionAmount;
        this._lawyerAmount = props.lawyerAmount;
        this._type = props.type;
        this._status = props.status;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    static create(props) {
        const now = new Date();
        return new CommissionTransaction({
            id: `commission-${(0, uuid_1.v4)()}`,
            bookingId: props.bookingId,
            clientId: props.clientId,
            lawyerId: props.lawyerId,
            baseFee: props.baseFee,
            subscriptionDiscount: props.subscriptionDiscount,
            followupDiscount: props.followupDiscount,
            amountPaid: props.amountPaid,
            commissionPercent: props.commissionPercent,
            commissionAmount: props.commissionAmount,
            lawyerAmount: props.lawyerAmount,
            type: props.type,
            status: "pending",
            createdAt: now,
            updatedAt: now,
        });
    }
    static fromPersistence(props) {
        return new CommissionTransaction(props);
    }
    get id() {
        return this._id;
    }
    get bookingId() {
        return this._bookingId;
    }
    get clientId() {
        return this._clientId;
    }
    get lawyerId() {
        return this._lawyerId;
    }
    get baseFee() {
        return this._baseFee;
    }
    get subscriptionDiscount() {
        return this._subscriptionDiscount;
    }
    get followupDiscount() {
        return this._followupDiscount;
    }
    get amountPaid() {
        return this._amountPaid;
    }
    get commissionPercent() {
        return this._commissionPercent;
    }
    get commissionAmount() {
        return this._commissionAmount;
    }
    get lawyerAmount() {
        return this._lawyerAmount;
    }
    get type() {
        return this._type;
    }
    get status() {
        return this._status;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    markAsCredited() {
        this._status = "credited";
        this._updatedAt = new Date();
    }
}
exports.CommissionTransaction = CommissionTransaction;
