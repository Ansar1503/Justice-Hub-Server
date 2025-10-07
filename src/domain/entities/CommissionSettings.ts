import { v4 as uuidv4 } from "uuid";

interface PersistedCommissionSettingsProps {
  id: string;
  initialCommission: number;
  followupCommission: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateCommissionSettingsProps {
  initialCommission: number;
  followupCommission: number;
}

export class CommissionSettings {
  private _id: string;
  private _initialCommission: number;
  private _followupCommission: number;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: PersistedCommissionSettingsProps) {
    this._id = props.id;
    this._initialCommission = props.initialCommission;
    this._followupCommission = props.followupCommission;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: CreateCommissionSettingsProps): CommissionSettings {
    const now = new Date();
    return new CommissionSettings({
      id: `commission-settings-${uuidv4()}`,
      initialCommission: props.initialCommission,
      followupCommission: props.followupCommission,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: PersistedCommissionSettingsProps) {
    return new CommissionSettings(props);
  }

  get id() {
    return this._id;
  }

  get initialCommission() {
    return this._initialCommission;
  }

  get followupCommission() {
    return this._followupCommission;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  updateCommissions(initialCommission: number, followupCommission: number) {
    this._initialCommission = initialCommission;
    this._followupCommission = followupCommission;
    this._updatedAt = new Date();
  }
}
