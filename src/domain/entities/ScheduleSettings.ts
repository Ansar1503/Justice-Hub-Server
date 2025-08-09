import { v4 as uuidv4 } from "uuid";

export interface PersistedScheduleSettingsProps {
  id: string;
  lawyer_id: string;
  slotDuration: number;
  maxDaysInAdvance: number;
  autoConfirm: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateScheduleSettingsProps {
  lawyer_id: string;
  slotDuration: number;
  maxDaysInAdvance: number;
  autoConfirm: boolean;
}

export class ScheduleSettings {
  private _id: string;
  private _lawyer_id: string;
  private _slotDuration: number;
  private _maxDaysInAdvance: number;
  private _autoConfirm: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: PersistedScheduleSettingsProps) {
    this._id = props.id;
    this._lawyer_id = props.lawyer_id;
    this._slotDuration = props.slotDuration;
    this._maxDaysInAdvance = props.maxDaysInAdvance;
    this._autoConfirm = props.autoConfirm;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: CreateScheduleSettingsProps): ScheduleSettings {
    const now = new Date();
    return new ScheduleSettings({
      id: uuidv4(),
      lawyer_id: props.lawyer_id,
      slotDuration: props.slotDuration,
      maxDaysInAdvance: props.maxDaysInAdvance,
      autoConfirm: props.autoConfirm,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: PersistedScheduleSettingsProps): ScheduleSettings {
    return new ScheduleSettings(props);
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get lawyerId(): string {
    return this._lawyer_id;
  }

  get slotDuration(): number {
    return this._slotDuration;
  }

  get maxDaysInAdvance(): number {
    return this._maxDaysInAdvance;
  }

  get autoConfirm(): boolean {
    return this._autoConfirm;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateSettings(slotDuration: number, maxDaysInAdvance: number, autoConfirm: boolean): void {
    this._slotDuration = slotDuration;
    this._maxDaysInAdvance = maxDaysInAdvance;
    this._autoConfirm = autoConfirm;
    this.touch();
  }

  private touch(): void {
    this._updatedAt = new Date();
  }
}
