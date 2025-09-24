import { v4 as uuidv4 } from "uuid";

export interface DocumentItem {
  name: string;
  type: string;
  url: string;
  _id?: string;
}

export interface PersistedSessionDocumentProps {
  id: string;
  session_id: string;
  caseId: string;
  client_id: string;
  document: DocumentItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSessionDocumentProps {
  session_id: string;
  client_id: string;
  caseId: string;
  document: DocumentItem[];
}

export class SessionDocument {
  private _id: string;
  private _session_id: string;
  private _client_id: string;
  private _caseId: string;
  private _document: DocumentItem[];
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: PersistedSessionDocumentProps) {
    this._id = props.id;
    this._session_id = props.session_id;
    this._client_id = props.client_id;
    this._caseId = props.caseId;
    this._document = props.document;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: CreateSessionDocumentProps): SessionDocument {
    const now = new Date();
    return new SessionDocument({
      id: uuidv4(),
      session_id: props.session_id,
      caseId: props.caseId,
      client_id: props.client_id,
      document: props.document,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(
    props: PersistedSessionDocumentProps
  ): SessionDocument {
    return new SessionDocument(props);
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get sessionId(): string {
    return this._session_id;
  }

  get caseId() {
    return this._caseId;
  }

  get clientId(): string {
    return this._client_id;
  }

  get documents(): DocumentItem[] {
    return this._document;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business Methods
  addDocument(doc: DocumentItem): void {
    this._document.push(doc);
    this.touch();
  }

  removeDocument(docName: string): void {
    this._document = this._document.filter((doc) => doc.name !== docName);
    this.touch();
  }

  updateDocuments(docs: DocumentItem[]): void {
    this._document = docs;
    this.touch();
  }

  private touch(): void {
    this._updatedAt = new Date();
  }
}
