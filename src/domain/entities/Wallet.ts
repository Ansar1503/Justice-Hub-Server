import { v4 as uuidv4 } from "uuid";

interface PersistedWalletProps {
  id: string;
  user_id: string;
  balance: number;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateWalletProps {
  user_id: string;
}

export class Wallet {
  private _id: string;
  private _user_id: string;
  private _balance: number;
  private _status: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;
  constructor(props: PersistedWalletProps) {
    this._id = props.id;
    this._user_id = props.user_id;
    this._balance = props.balance;
    this._status = props.status;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }
  static create(props: CreateWalletProps) {
    const now = new Date();
    return new Wallet({
      balance: 0,
      status: true,
      createdAt: now,
      updatedAt: now,
      user_id: props.user_id,
      id: `w-${uuidv4()}`,
    });
  }

  static fromPersisted(props: PersistedWalletProps) {
    return new Wallet(props);
  }

  get id() {
    return this._id;
  }
  get user_id() {
    return this._user_id;
  }
  get balance() {
    return this._balance;
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

  updateStatus(status: boolean) {
    this._status = status;
    this._updatedAt = new Date();
  }
  updateBalance(balance: number) {
    this._balance = balance;
    this._updatedAt = new Date();
  }
}
