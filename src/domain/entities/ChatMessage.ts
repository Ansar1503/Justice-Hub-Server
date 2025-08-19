import { v4 as uuidv4 } from "uuid";

export interface Attachment {
  name: string;
  url: string;
  type: string;
}

export interface PersistedChatMessageProps {
  id: string;
  session_id: string;
  senderId: string;
  receiverId: string;
  content?: string;
  read: boolean;
  active: boolean;
  attachments?: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateChatMessageProps {
  session_id: string;
  senderId: string;
  receiverId: string;
  content?: string;
  attachments?: Attachment[];
}

export class ChatMessage {
  private _id: string;
  private _session_id: string;
  private _senderId: string;
  private _receiverId: string;
  private _content?: string;
  private _read: boolean;
  private _active: boolean;
  private _attachments?: Attachment[];
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: PersistedChatMessageProps) {
    this._id = props.id;
    this._session_id = props.session_id;
    this._senderId = props.senderId;
    this._receiverId = props.receiverId;
    this._content = props.content;
    this._read = props.read;
    this._active = props.active;
    this._attachments = props.attachments;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: CreateChatMessageProps): ChatMessage {
    const now = new Date();
    return new ChatMessage({
      id: `cm-${uuidv4()}`,
      session_id: props.session_id,
      senderId: props.senderId,
      receiverId: props.receiverId,
      content: props.content,
      read: false,
      active: true,
      attachments: props.attachments,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: PersistedChatMessageProps): ChatMessage {
    return new ChatMessage(props);
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get sessionId(): string {
    return this._session_id;
  }

  get senderId(): string {
    return this._senderId;
  }

  get receiverId(): string {
    return this._receiverId;
  }

  get content(): string | undefined {
    return this._content;
  }

  get read(): boolean {
    return this._read;
  }

  get active(): boolean {
    return this._active;
  }

  get attachments(): Attachment[] | undefined {
    return this._attachments;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  //   Methods
  markAsRead(): void {
    this._read = true;
    this.touch();
  }

  deleteMessage(): void {
    this._active = false;
    this.touch();
  }

  updateContent(newContent: string): void {
    this._content = newContent;
    this.touch();
  }

  addAttachment(attachment: Attachment): void {
    if (!this._attachments) {
      this._attachments = [];
    }
    this._attachments.push(attachment);
    this.touch();
  }

  private touch(): void {
    this._updatedAt = new Date();
  }
}
