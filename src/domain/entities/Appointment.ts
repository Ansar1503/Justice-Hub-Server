import { v4 as uuidv4 } from "uuid";

type PaymentStatus = "pending" | "success" | "failed";
type AppointmentType = "consultation" | "follow-up";
type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "rejected";

interface PersistedAppointmentProps {
  id: string;
  lawyer_id: string;
  client_id: string;
  caseId: string;
  date: Date;
  time: string;
  duration: number;
  reason: string;
  amount: number;
  payment_status: PaymentStatus;
  type: AppointmentType;
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateAppointmentProps {
  lawyer_id: string;
  client_id: string;
  caseId: string;
  date: Date;
  payment_status: PaymentStatus;
  time: string;
  duration: number;
  reason: string;
  amount: number;
  type: AppointmentType;
}

export class Appointment {
  private _id: string;
  private _lawyer_id: string;
  private _client_id: string;
  private _caseId: string;
  private _date: Date;
  private _time: string;
  private _duration: number;
  private _reason: string;
  private _amount: number;
  private _payment_status: PaymentStatus;
  private _type: AppointmentType;
  private _status: AppointmentStatus;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: PersistedAppointmentProps) {
    this._id = props.id;
    this._lawyer_id = props.lawyer_id;
    this._client_id = props.client_id;
    this._caseId = props.caseId;
    this._date = props.date;
    this._time = props.time;
    this._duration = props.duration;
    this._reason = props.reason;
    this._amount = props.amount;
    this._payment_status = props.payment_status;
    this._type = props.type;
    this._status = props.status;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: CreateAppointmentProps): Appointment {
    const now = new Date();
    return new Appointment({
      id: `amt-${uuidv4()}`,
      lawyer_id: props.lawyer_id,
      client_id: props.client_id,
      caseId: props.caseId,
      date: props.date,
      time: props.time,
      duration: props.duration,
      reason: props.reason,
      amount: props.amount,
      payment_status: props.payment_status,
      type: props.type,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: PersistedAppointmentProps): Appointment {
    return new Appointment(props);
  }

  get id(): string {
    return this._id;
  }

  get caseId() {
    return this._caseId;
  }

  get lawyer_id(): string {
    return this._lawyer_id;
  }

  get client_id(): string {
    return this._client_id;
  }

  get date(): Date {
    return this._date;
  }

  get time(): string {
    return this._time;
  }

  get duration(): number {
    return this._duration;
  }

  get reason(): string {
    return this._reason;
  }

  get amount(): number {
    return this._amount;
  }

  get payment_status(): PaymentStatus {
    return this._payment_status;
  }

  get type(): AppointmentType {
    return this._type;
  }

  get status(): AppointmentStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  confirm(): void {
    this._status = "confirmed";
    this.touch();
  }

  complete(): void {
    this._status = "completed";
    this.touch();
  }

  cancel(): void {
    this._status = "cancelled";
    this.touch();
  }

  reject(): void {
    this._status = "rejected";
    this.touch();
  }

  markPaymentSuccess(): void {
    this._payment_status = "success";
    this.touch();
  }

  markPaymentFailed(): void {
    this._payment_status = "failed";
    this.touch();
  }

  updateReason(newReason: string): void {
    this._reason = newReason;
    this.touch();
  }

  private touch(): void {
    this._updatedAt = new Date();
  }
}
