import { v4 as uuidv4 } from "uuid";

type SessionType = "consultation" | "follow-up";
type SessionStatus =
  | "upcoming"
  | "ongoing"
  | "completed"
  | "cancelled"
  | "missed";

export interface PersistedSessionProps {
  id: string;
  appointment_id: string;
  lawyer_id: string;
  client_id: string;
  scheduled_date: Date;
  scheduled_time: string;
  duration: number;
  reason: string;
  amount: number;
  type: SessionType;
  status: SessionStatus;
  notes?: string;
  summary?: string;
  follow_up_suggested?: boolean;
  follow_up_session_id?: string;
  room_id?: string;
  start_time?: Date;
  end_time?: Date;
  client_joined_at?: Date;
  client_left_at?: Date;
  lawyer_joined_at?: Date;
  lawyer_left_at?: Date;
  end_reason?: string;
  callDuration?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSessionProps {
  appointment_id: string;
  lawyer_id: string;
  client_id: string;
  scheduled_date: Date;
  scheduled_time: string;
  duration: number;
  reason: string;
  amount: number;
  type: SessionType;
  status: SessionStatus;
}

export class Session {
  private _id: string;
  private _appointment_id: string;
  private _lawyer_id: string;
  private _client_id: string;
  private _scheduled_date: Date;
  private _scheduled_time: string;
  private _duration: number;
  private _reason: string;
  private _amount: number;
  private _type: SessionType;
  private _status: SessionStatus;

  private _notes?: string;
  private _summary?: string;
  private _follow_up_suggested?: boolean;
  private _follow_up_session_id?: string;
  private _room_id?: string;
  private _start_time?: Date;
  private _end_time?: Date;
  private _client_joined_at?: Date;
  private _client_left_at?: Date;
  private _lawyer_joined_at?: Date;
  private _lawyer_left_at?: Date;
  private _end_reason?: string;
  private _callDuration?: number;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: PersistedSessionProps) {
    this._id = props.id;
    this._appointment_id = props.appointment_id;
    this._lawyer_id = props.lawyer_id;
    this._client_id = props.client_id;
    this._scheduled_date = props.scheduled_date;
    this._scheduled_time = props.scheduled_time;
    this._duration = props.duration;
    this._reason = props.reason;
    this._amount = props.amount;
    this._type = props.type;
    this._status = props.status;
    this._notes = props.notes;
    this._summary = props.summary;
    this._follow_up_suggested = props.follow_up_suggested;
    this._follow_up_session_id = props.follow_up_session_id;
    this._room_id = props.room_id;
    this._start_time = props.start_time;
    this._end_time = props.end_time;
    this._client_joined_at = props.client_joined_at;
    this._client_left_at = props.client_left_at;
    this._lawyer_joined_at = props.lawyer_joined_at;
    this._lawyer_left_at = props.lawyer_left_at;
    this._end_reason = props.end_reason;
    this._callDuration = props.callDuration;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: CreateSessionProps): Session {
    const now = new Date();
    return new Session({
      id: uuidv4(),
      ...props,
      createdAt: now, 
      updatedAt: now,
    });
  }

  static fromPersistence(props: PersistedSessionProps): Session {
    return new Session(props);
  }

  // Getters
  get id() {
    return this._id;
  }

  get appointment_id() {
    return this._appointment_id;
  }

  get lawyer_id() {
    return this._lawyer_id;
  }

  get client_id() {
    return this._client_id;
  }

  get scheduled_date() {
    return this._scheduled_date;
  }

  get scheduled_time() {
    return this._scheduled_time;
  }

  get duration() {
    return this._duration;
  }

  get reason() {
    return this._reason;
  }

  get amount() {
    return this._amount;
  }

  get type() {
    return this._type;
  }

  get status() {
    return this._status;
  }

  get notes() {
    return this._notes;
  }

  get summary() {
    return this._summary;
  }

  get follow_up_suggested() {
    return this._follow_up_suggested;
  }

  get follow_up_session_id() {
    return this._follow_up_session_id;
  }

  get room_id() {
    return this._room_id;
  }

  get start_time() {
    return this._start_time;
  }

  get end_time() {
    return this._end_time;
  }

  get client_joined_at() {
    return this._client_joined_at;
  }

  get client_left_at() {
    return this._client_left_at;
  }

  get lawyer_joined_at() {
    return this._lawyer_joined_at;
  }

  get lawyer_left_at() {
    return this._lawyer_left_at;
  }

  get end_reason() {
    return this._end_reason;
  }

  get callDuration() {
    return this._callDuration;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  //methosd
  updateStatus(status: SessionStatus): void {
    this._status = status;
    this.touch();
  }

  setStartTime(time: Date): void {
    this._start_time = time;
    this.touch();
  }

  setEndTime(time: Date): void {
    this._end_time = time;
    this.touch();
  }

  recordCallDuration(): void {
    if (this._start_time && this._end_time) {
      this._callDuration = Math.floor(
        (this._end_time.getTime() - this._start_time.getTime()) / 1000
      ); // in seconds
      this.touch();
    }
  }

  updateNotesAndSummary(notes?: string, summary?: string): void {
    this._notes = notes;
    this._summary = summary;
    this.touch();
  }

  private touch(): void {
    this._updatedAt = new Date();
  }
}
