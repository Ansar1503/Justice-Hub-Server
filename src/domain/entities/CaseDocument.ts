import { v4 as uuidv4 } from "uuid";

export interface DocumentItem {
    name: string;
    type: string;
    url: string;
}

export interface PersistedCaseDocumentProps {
    id: string;
    caseId: string;
    uploadedBy: string;
    document: DocumentItem;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateCaseDocumentProps {
    caseId: string;
    uploadedBy: string;
    document: DocumentItem;
}

export class CaseDocument {
    private _id: string;
    private _caseId: string;
    private _uploadedBy: string;
    private _document: DocumentItem;
    private _createdAt: Date;
    private _updatedAt: Date;

    private constructor(props: PersistedCaseDocumentProps) {
        this._id = props.id;
        this._caseId = props.caseId;
        this._uploadedBy = props.uploadedBy;
        this._document = props.document;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }

    static create(props: CreateCaseDocumentProps): CaseDocument {
        const now = new Date();
        return new CaseDocument({
            id: uuidv4(),
            caseId: props.caseId,
            uploadedBy: props.uploadedBy,
            document: props.document,
            createdAt: now,
            updatedAt: now,
        });
    }

    static fromPersistence(props: PersistedCaseDocumentProps): CaseDocument {
        return new CaseDocument(props);
    }

    // Getters
    get id(): string {
        return this._id;
    }

    get caseId(): string {
        return this._caseId;
    }

    get uploadedBy() {
        return this._uploadedBy;
    }

    get document(): DocumentItem {
        return this._document;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    updateDocument(newDoc: DocumentItem): void {
        this._document = newDoc;
        this.touch();
    }

    private touch(): void {
        this._updatedAt = new Date();
    }
}
