import { v4 as uuidv4 } from "uuid";

export type PaymentPurpose = "subscription" | "appointment";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentProvider = "stripe";

export interface PersistedPaymentProps {
  id: string;
  clientId: string;
  paidFor: PaymentPurpose;
  referenceId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  providerRefId: string;
  createdAt: Date;
}

export interface CreatePaymentProps {
  clientId: string;
  paidFor: PaymentPurpose;
  referenceId: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  providerRefId: string;
}

export class Payment {
  private _id: string;
  private _clientId: string;
  private _paidFor: PaymentPurpose;
  private _referenceId: string;
  private _amount: number;
  private _currency: string;
  private _status: PaymentStatus;
  private _provider: PaymentProvider;
  private _providerRefId: string;
  private _createdAt: Date;

  private constructor(props: PersistedPaymentProps) {
    this._id = props.id;
    this._clientId = props.clientId;
    this._paidFor = props.paidFor;
    this._referenceId = props.referenceId;
    this._amount = props.amount;
    this._currency = props.currency;
    this._status = props.status;
    this._provider = props.provider;
    this._providerRefId = props.providerRefId;
    this._createdAt = props.createdAt;
  }

  static create(props: CreatePaymentProps): Payment {
    return new Payment({
      id: `payment-${uuidv4()}`,
      clientId: props.clientId,
      paidFor: props.paidFor,
      referenceId: props.referenceId,
      amount: props.amount,
      currency: props.currency,
      status: "paid",
      provider: props.provider,
      providerRefId: props.providerRefId,
      createdAt: new Date(),
    });
  }

  static fromPersistence(props: PersistedPaymentProps): Payment {
    return new Payment(props);
  }

  get id() {
    return this._id;
  }

  get clientId() {
    return this._clientId;
  }

  get paidFor() {
    return this._paidFor;
  }

  get referenceId() {
    return this._referenceId;
  }

  get amount() {
    return this._amount;
  }

  get currency() {
    return this._currency;
  }

  get status() {
    return this._status;
  }

  get provider() {
    return this._provider;
  }

  get providerRefId() {
    return this._providerRefId;
  }

  get createdAt() {
    return this._createdAt;
  }
  updateStatus(status: PaymentStatus) {
    this._status = status;
  }

  refund() {
    if (this._status !== "paid") {
      throw new Error("Only paid payments can be refunded");
    }
    this._status = "refunded";
  }
}
