import { v4 as uuidv4 } from "uuid";

export interface DocumentItem {
  name: string;
  type: string;
  url: string;
}

export interface PersistedCaseDocumentProps {
  id: string;
  caseId: string;
  uploadBy: string;
  document: DocumentItem;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCaseDocumentProps {
  caseId: string;
  uploadBy: string;
  document: DocumentItem;
}

export class CaseDocument {
  private _id: string;
  private _caseId: string;
  private _uploadBy: string;
  private _document: DocumentItem;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: PersistedCaseDocumentProps) {
    this._id = props.id;
    this._caseId = props.caseId;
    this._uploadBy = props.uploadBy;
    this._document = props.document;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: CreateCaseDocumentProps): CaseDocument {
    const now = new Date();
    return new CaseDocument({
      id: uuidv4(),
      caseId: props.caseId,
      uploadBy: props.uploadBy,
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

  get uploadBy() {
    return this._uploadBy;
  }

  get caseId(): string {
    return this._caseId;
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
}
