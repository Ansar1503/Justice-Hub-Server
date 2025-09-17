import { v4 as uuidv4 } from "uuid";

  interface TimeRange {
    start: string;
    end: string;
  }

  interface OverrideDate {
    date: Date;
    isUnavailable: boolean;
    timeRanges: TimeRange[];
  }

interface PersistedOverrideSlots {
  id: string;
  lawyer_id: string;
  overrideDates: OverrideDate[];
  createdAt: Date;
  updatedAt: Date;
}

interface CreateOverrideSlots {
  lawyer_id: string;
  overrideDates: OverrideDate[];
}

export class Override {
  private _id: string;
  private _lawyer_id: string;
  private _overrideDates: OverrideDate[];
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: PersistedOverrideSlots) {
    this._id = props.id;
    this._lawyer_id = props.lawyer_id;
    this._overrideDates = props.overrideDates;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: CreateOverrideSlots): Override {
    const now = new Date();
    return new Override({
      id: uuidv4(),
      lawyer_id: props.lawyer_id,
      overrideDates: props.overrideDates,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: PersistedOverrideSlots): Override {
    return new Override(props);
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get lawyerId(): string {
    return this._lawyer_id;
  }

  get overrideDates(): OverrideDate[] {
    return this._overrideDates;
  }

  //  Methods
  updateOverrideDates(newDates: OverrideDate[]): void {
    this._overrideDates = newDates;
  }

  addOverrideDate(date: OverrideDate): void {
    this._overrideDates.push(date);
  }

  removeOverrideDate(dateToRemove: Date): void {
    this._overrideDates = this._overrideDates.filter(
      (entry) => entry.date.getTime() !== dateToRemove.getTime()
    );
  }
}
