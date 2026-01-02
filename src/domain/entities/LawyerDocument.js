"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LawyerDocuments = void 0;
const uuid_1 = require("uuid");
class LawyerDocuments {
    _id;
    _userId;
    _enrollmentCertificate;
    _certificateOfPractice;
    _barCouncilCertificate;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._userId = props.userId;
        this._enrollmentCertificate = props.enrollmentCertificate;
        this._certificateOfPractice = props.certificateOfPractice;
        this._barCouncilCertificate = props.barCouncilCertificate;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    static create(props) {
        const now = new Date();
        return new LawyerDocuments({
            ...props,
            id: (0, uuid_1.v4)(),
            createdAt: now,
            updatedAt: now,
        });
    }
    static fromPersistence(raw) {
        return new LawyerDocuments(raw);
    }
    toPersistence() {
        return {
            id: this._id,
            userId: this._userId,
            enrollmentCertificate: this._enrollmentCertificate,
            certificateOfPractice: this._certificateOfPractice,
            barCouncilCertificate: this._barCouncilCertificate,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }
    // Getters
    get id() {
        return this._id;
    }
    get userId() {
        return this._userId;
    }
    get enrollmentCertificate() {
        return this._enrollmentCertificate;
    }
    get certificateOfPractice() {
        return this._certificateOfPractice;
    }
    get barCouncilCertificate() {
        return this._barCouncilCertificate;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    update(props) {
        let changed = false;
        if (props.enrollmentCertificate !== undefined) {
            this._enrollmentCertificate = props.enrollmentCertificate;
            changed = true;
        }
        if (props.certificateOfPractice !== undefined) {
            this._certificateOfPractice = props.certificateOfPractice;
            changed = true;
        }
        if (props.barCouncilCertificate !== undefined) {
            this._barCouncilCertificate = props.barCouncilCertificate;
            changed = true;
        }
        if (changed) {
            this._updatedAt = new Date();
        }
    }
}
exports.LawyerDocuments = LawyerDocuments;
