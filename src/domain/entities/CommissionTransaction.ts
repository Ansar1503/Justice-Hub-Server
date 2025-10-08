import { v4 as uuidv4 } from "uuid";

type BookingType = "initial" | "followup";
type TransactionStatus = "pending" | "credited" | "failed";

interface PersistedCommissionTransactionProps {
  id: string;
  bookingId: string;
  clientId: string;
  lawyerId: string;
  amountPaid: number;
  commissionPercent: number;
  commissionAmount: number;
  lawyerAmount: number;
  type: BookingType;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateCommissionTransactionProps {
  bookingId: string;
  clientId: string;
  lawyerId: string;
  amountPaid: number;
  commissionPercent: number;
  commissionAmount: number;
  lawyerAmount: number;
  type: BookingType;
}

export class CommissionTransaction {
  private _id: string;
  private _bookingId: string;
  private _clientId: string;
  private _lawyerId: string;
  private _amountPaid: number;
  private _commissionPercent: number;
  private _commissionAmount: number;
  private _lawyerAmount: number;
  private _type: BookingType;
  private _status: TransactionStatus;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: PersistedCommissionTransactionProps) {
    this._id = props.id;
    this._bookingId = props.bookingId;
    this._clientId = props.clientId;
    this._lawyerId = props.lawyerId;
    this._amountPaid = props.amountPaid;
    this._commissionPercent = props.commissionPercent;
    this._commissionAmount = props.commissionAmount;
    this._lawyerAmount = props.lawyerAmount;
    this._type = props.type;
    this._status = props.status;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(
    props: CreateCommissionTransactionProps
  ): CommissionTransaction {
    const now = new Date();

    return new CommissionTransaction({
      id: `commission-${uuidv4()}`,
      bookingId: props.bookingId,
      clientId: props.clientId,
      lawyerId: props.lawyerId,
      amountPaid: props.amountPaid,
      commissionPercent: props.commissionPercent,
      commissionAmount: props.commissionAmount,
      lawyerAmount: props.lawyerAmount,
      type: props.type,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: PersistedCommissionTransactionProps) {
    return new CommissionTransaction(props);
  }

  get id() {
    return this._id;
  }

  get bookingId() {
    return this._bookingId;
  }

  get clientId() {
    return this._clientId;
  }

  get lawyerId() {
    return this._lawyerId;
  }

  get amountPaid() {
    return this._amountPaid;
  }

  get commissionPercent() {
    return this._commissionPercent;
  }

  get commissionAmount() {
    return this._commissionAmount;
  }

  get lawyerAmount() {
    return this._lawyerAmount;
  }

  get type() {
    return this._type;
  }

  get status() {
    return this._status;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  markAsCredited() {
    this._status = "credited";
    this._updatedAt = new Date();
  }
}
