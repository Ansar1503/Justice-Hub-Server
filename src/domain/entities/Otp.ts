import { v4 as uuid } from "uuid";

export interface PersistedOtpProps {
  id: string;
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOtpProps {
  email: string;
  otp: string;
}

export class Otp {
  private _id: string;
  private _email: string;
  private _otp: string;
  private _expiresAt: Date;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: PersistedOtpProps) {
    this._id = props.id;
    this._email = props.email;
    this._otp = props.otp;
    this._expiresAt = props.expiresAt;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: CreateOtpProps): Otp {
    const expiresAt = new Date(Date.now() + 60 * 1000);
    const now = new Date();
    return new Otp({
      id: `otp-${uuid()}`,
      email: props.email,
      otp: props.otp,
      expiresAt,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: PersistedOtpProps): Otp {
    return new Otp(props);
  }

  // Getters
  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get email(): string {
    return this._email;
  }

  get otp(): string {
    return this._otp;
  }

  get expiresAt(): Date {
    return this._expiresAt;
  }

  isExpired(): boolean {
    return new Date() > this._expiresAt;
  }
}
