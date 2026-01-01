export interface PersistedCallLogsProps {
    id: string;
    roomId: string;
    session_id: string;
    start_time: Date;
    end_time?: Date;
    client_joined_at?: Date;
    client_left_at?: Date;
    lawyer_joined_at?: Date;
    lawyer_left_at?: Date;
    callDuration?: number;
    status: "ongoing" | "completed" | "cancelled" | "missed" | "dropped";
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateCallLogsProps {
    roomId: string;
    session_id: string;
    start_time?: Date;
    end_time?: Date;
    client_joined_at?: Date;
    client_left_at?: Date;
    lawyer_joined_at?: Date;
    lawyer_left_at?: Date;
    callDuration?: number;
    status: "ongoing" | "completed" | "cancelled" | "missed" | "dropped";
}

export class CallLogs {
    private _id: string;
    private _roomId: string;
    private _session_id: string;
    private _start_time?: Date;
    private _end_time?: Date;
    private _client_joined_at?: Date;
    private _client_left_at?: Date;
    private _lawyer_joined_at?: Date;
    private _lawyer_left_at?: Date;
    private _callDuration?: number;
    private _status: "ongoing" | "completed" | "cancelled" | "missed" | "dropped";
    private _createdAt: Date;
    private _updatedAt: Date;

    private constructor(props: PersistedCallLogsProps) {
        this._id = props.id;
        this._roomId = props.roomId;
        this._session_id = props.session_id;
        this._start_time = props.start_time;
        this._end_time = props.end_time;
        this._client_joined_at = props.client_joined_at;
        this._client_left_at = props.client_left_at;
        this._lawyer_joined_at = props.lawyer_joined_at;
        this._lawyer_left_at = props.lawyer_left_at;
        this._callDuration = props.callDuration;
        this._status = props.status;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }

    static create(props: CreateCallLogsProps): CallLogs {
        const now = new Date();
        return new CallLogs({
            id: `clg-${crypto.randomUUID()}`,
            roomId: props.roomId,
            session_id: props.session_id,
            status: props.status,
            start_time: now,
            createdAt: now,
            updatedAt: now,
        });
    }

    static fromPersistence(props: PersistedCallLogsProps): CallLogs {
        return new CallLogs(props);
    }

    // Getters
    get id(): string {
        return this._id;
    }

    get roomId(): string {
        return this._roomId;
    }

    get session_id(): string {
        return this._session_id;
    }

    get start_time(): Date | undefined {
        return this._start_time;
    }

    get end_time(): Date | undefined {
        return this._end_time;
    }

    get client_joined_at(): Date | undefined {
        return this._client_joined_at;
    }

    get client_left_at(): Date | undefined {
        return this._client_left_at;
    }

    get lawyer_joined_at(): Date | undefined {
        return this._lawyer_joined_at;
    }

    get lawyer_left_at(): Date | undefined {
        return this._lawyer_left_at;
    }

    get callDuration(): number | undefined {
        return this._callDuration;
    }

    get status(): "ongoing" | "completed" | "cancelled" | "missed" | "dropped" {
        return this._status;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    // Methods
    updateStatus(status: typeof this._status): void {
        this._status = status;
        this.touch();
    }

    updateCallTimes(props: Partial<Omit<CreateCallLogsProps, "roomId" | "session_id" | "status">>): void {
        let changed = false;
        if (props.start_time !== undefined) {
            this._start_time = props.start_time;
            changed = true;
        }
        if (props.end_time !== undefined) {
            this._end_time = props.end_time;
            changed = true;
        }
        if (props.client_joined_at !== undefined) {
            this._client_joined_at = props.client_joined_at;
            changed = true;
        }
        if (props.client_left_at !== undefined) {
            this._client_left_at = props.client_left_at;
            changed = true;
        }
        if (props.lawyer_joined_at !== undefined) {
            this._lawyer_joined_at = props.lawyer_joined_at;
            changed = true;
        }
        if (props.lawyer_left_at !== undefined) {
            this._lawyer_left_at = props.lawyer_left_at;
            changed = true;
        }
        if (props.callDuration !== undefined) {
            this._callDuration = props.callDuration;
            changed = true;
        }
        if (changed) {
            this.touch();
        }
    }

    private touch(): void {
        this._updatedAt = new Date();
    }
}
