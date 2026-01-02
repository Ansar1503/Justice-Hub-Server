"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseDocument = void 0;
const uuid_1 = require("uuid");
class CaseDocument {
    _id;
    _caseId;
    _uploadedBy;
    _document;
    _createdAt;
    _updatedAt;
    constructor(props) {
        this._id = props.id;
        this._caseId = props.caseId;
        this._uploadedBy = props.uploadedBy;
        this._document = props.document;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }
    static create(props) {
        const now = new Date();
        return new CaseDocument({
            id: (0, uuid_1.v4)(),
            caseId: props.caseId,
            uploadedBy: props.uploadedBy,
            document: props.document,
            createdAt: now,
            updatedAt: now,
        });
    }
    static fromPersistence(props) {
        return new CaseDocument(props);
    }
    // Getters
    get id() {
        return this._id;
    }
    get caseId() {
        return this._caseId;
    }
    get uploadedBy() {
        return this._uploadedBy;
    }
    get document() {
        return this._document;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    updateDocument(newDoc) {
        this._document = newDoc;
        this.touch();
    }
    touch() {
        this._updatedAt = new Date();
    }
}
exports.CaseDocument = CaseDocument;
