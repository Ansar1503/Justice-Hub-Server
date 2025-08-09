import { v4 as uuidv4 } from "uuid";

export type NotificationType = "message" | "session";

export interface PersistedNotificationProps {
  id: string;
  recipientId: string;
  senderId: string;
  type: NotificationType;
  roomId?: string;
  sessionId?: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotificationProps {
  recipientId: string;
  senderId: string;
  type: NotificationType;
  roomId?: string;
  sessionId?: string;
  title: string;
  message: string;
}

export class Notification {
  private _id: string;
  private _recipientId: string;
  private _senderId: string;
  private _type: NotificationType;
  private _roomId?: string;
  private _sessionId?: string;
  private _title: string;
  private _message: string;
  private _isRead: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: PersistedNotificationProps) {
    this._id = props.id;
    this._recipientId = props.recipientId;
    this._senderId = props.senderId;
    this._type = props.type;
    this._roomId = props.roomId;
    this._sessionId = props.sessionId;
    this._title = props.title;
    this._message = props.message;
    this._isRead = props.isRead;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: CreateNotificationProps): Notification {
    const now = new Date();
    return new Notification({
      id: uuidv4(),
      recipientId: props.recipientId,
      senderId: props.senderId,
      type: props.type,
      roomId: props.roomId,
      sessionId: props.sessionId,
      title: props.title,
      message: props.message,
      isRead: false,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: PersistedNotificationProps): Notification {
    return new Notification(props);
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get recipientId(): string {
    return this._recipientId;
  }

  get senderId(): string {
    return this._senderId;
  }

  get type(): NotificationType {
    return this._type;
  }

  get roomId(): string | undefined {
    return this._roomId;
  }

  get sessionId(): string | undefined {
    return this._sessionId;
  }

  get title(): string {
    return this._title;
  }

  get message(): string {
    return this._message;
  }

  get isRead(): boolean {
    return this._isRead;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

// methods
  markAsRead(): void {
    this._isRead = true;
    this.touch();
  }

  updateMessage(newMessage: string): void {
    this._message = newMessage;
    this.touch();
  }

  updateTitle(newTitle: string): void {
    this._title = newTitle;
    this.touch();
  }

  private touch(): void {
    this._updatedAt = new Date();
  }
}
