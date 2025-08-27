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
  balance: number;
  status: boolean;
}

export class Wallet {
  private _id: string;
  private _user_id: string;
  private _balance: number;
  private _status: boolean;
  private _createdAt: Date;
  private _udpatedAt: Date;
  constructor(props: PersistedWalletProps) {
    this._id = props.id;
    this._user_id = props.user_id;
    this._balance = props.balance;
    this._status = props.status;
    this._createdAt = props.createdAt;
    this._udpatedAt = props.updatedAt;
  }
  static create(props: CreateWalletProps) {
    const now = new Date();
    return new Wallet({
      balance: props.balance,
      status: props.status,
      createdAt: now,
      updatedAt: now,
      user_id: props.user_id,
      id: `w-${uuidv4()}`,
    });
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
  get udpatedAt() {
    return this._udpatedAt;
  }

  updateStatus(status: boolean) {
    this._status = status;
    this._udpatedAt = new Date();
  }
  updateBalance(balance: number) {
    this._balance = balance;
    this._udpatedAt = new Date();
  }
}
