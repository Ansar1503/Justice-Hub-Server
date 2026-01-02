"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LawyerVerification = void 0;
const uuid_1 = require("uuid");
class LawyerVerification {
    _id;
    _userId;
    _barCouncilNumber;
    _enrollmentCertificateNumber;
    _certificateOfPracticeNumber;
    _verificationStatus;
    _rejectReason;
    _documents;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._userId = props.userId;
        this._barCouncilNumber = props.barCouncilNumber;
        this._enrollmentCertificateNumber = props.enrollmentCertificateNumber;
        this._certificateOfPracticeNumber = props.certificateOfPracticeNumber;
        this._verificationStatus = props.verificationStatus;
        this._rejectReason = props.rejectReason ?? undefined;
        this._documents = props.documents;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    static fromPersistence(props) {
        return new LawyerVerification(props);
    }
    static create(props) {
        const now = new Date();
        return new LawyerVerification({
            ...props,
            id: (0, uuid_1.v4)(),
            verificationStatus: props.verificationStatus,
            createdAt: now,
            updatedAt: now,
        });
    }
    get id() {
        return this._id;
    }
    get userId() {
        return this._userId;
    }
    get verificationStatus() {
        return this._verificationStatus;
    }
    get barCouncilNumber() {
        return this._barCouncilNumber;
    }
    get enrollmentCertificateNumber() {
        return this._enrollmentCertificateNumber;
    }
    get certificateOfPracticeNumber() {
        return this._certificateOfPracticeNumber;
    }
    get documents() {
        return this._documents;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    set verificationStatus(status) {
        this._verificationStatus = status;
    }
    get rejectReason() {
        return this._rejectReason;
    }
    set rejectReason(reason) {
        this._rejectReason = reason;
    }
    update(props) {
        let changed = false;
        if (props.barCouncilNumber !== undefined) {
            this._barCouncilNumber = props.barCouncilNumber;
            changed = true;
        }
        if (props.enrollmentCertificateNumber !== undefined) {
            this._enrollmentCertificateNumber = props.enrollmentCertificateNumber;
            changed = true;
        }
        if (props.certificateOfPracticeNumber !== undefined) {
            this._certificateOfPracticeNumber = props.certificateOfPracticeNumber;
            changed = true;
        }
        if (props.verificationStatus !== undefined) {
            this._verificationStatus = props.verificationStatus;
            changed = true;
        }
        if (props.rejectReason !== undefined) {
            this._rejectReason = props.rejectReason;
            changed = true;
        }
        if (props.documents !== undefined) {
            this._documents = props.documents;
            changed = true;
        }
        if (changed) {
            this._updatedAt = new Date();
        }
    }
}
exports.LawyerVerification = LawyerVerification;
