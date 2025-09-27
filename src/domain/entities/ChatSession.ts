import { v4 as uuidv4 } from "uuid";

export interface ChatParticipants {
  lawyer_id: string;
  client_id: string;
}

export interface PersistedChatSessionProps {
  id: string;
  name: string;
  participants: ChatParticipants;
  last_message: string;
  session_id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateChatSessionProps {
  name: string;
  participants: ChatParticipants;
  last_message: string;
  session_id: string;
}

export class ChatSession {
    private _id: string;
    private _name: string;
    private _participants: ChatParticipants;
    private _last_message: string;
    private _session_id: string;
    private _createdAt: Date;
    private _updatedAt: Date;

    private constructor(props: PersistedChatSessionProps) {
        this._id = props.id;
        this._name = props.name;
        this._participants = props.participants;
        this._last_message = props.last_message;
        this._session_id = props.session_id;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }

    static create(props: CreateChatSessionProps): ChatSession {
        const now = new Date();
        return new ChatSession({
            id: `cs-${uuidv4()}`,
            name: props.name,
            participants: props.participants,
            last_message: props.last_message,
            session_id: props.session_id,
            createdAt: now,
            updatedAt: now,
        });
    }

    static fromPersistence(props: PersistedChatSessionProps): ChatSession {
        return new ChatSession(props);
    }

    // getters
    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get participants(): ChatParticipants {
        return this._participants;
    }

    get lastMessage(): string {
        return this._last_message;
    }

    get sessionId(): string {
        return this._session_id;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    // methods
    updateLastMessage(message: string): void {
        this._last_message = message;
        this.touch();
    }

    renameSession(newName: string): void {
        this._name = newName;
        this.touch();
    }

    private touch(): void {
        this._updatedAt = new Date();
    }
}
