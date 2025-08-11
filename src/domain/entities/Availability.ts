import { v4 as uuid } from "uuid";

type Daytype =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

interface TimeSlot {
  start: string;
  end: string;
}

interface DayAvailability {
  enabled: boolean;
  timeSlots: TimeSlot[];
}
interface AvailabilityProps {
  id: string;
  lawyer_id: string;
  monday: DayAvailability;
  tuesday: DayAvailability;
  wednesday: DayAvailability;
  thursday: DayAvailability;
  friday: DayAvailability;
  saturday: DayAvailability;
  sunday: DayAvailability;
  createdAt: Date;
  updatedAt: Date;
}

export class Availability {
  private _id: string;
  private _lawyer_id: string;
  private _monday: DayAvailability;
  private _tuesday: DayAvailability;
  private _wednesday: DayAvailability;
  private _thursday: DayAvailability;
  private _friday: DayAvailability;
  private _saturday: DayAvailability;
  private _sunday: DayAvailability;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: AvailabilityProps) {
    this._id = props.id;
    this._lawyer_id = props.lawyer_id;
    this._monday = props.monday;
    this._tuesday = props.tuesday;
    this._wednesday = props.wednesday;
    this._thursday = props.thursday;
    this._friday = props.friday;
    this._saturday = props.saturday;
    this._sunday = props.sunday;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(defaultSlots?: Partial<AvailabilityProps>): Availability {
    function setDefaultDay(day: Daytype): DayAvailability {
      return {
        enabled: day !== "saturday" && day !== "sunday",
        timeSlots: [{ start: "09:00", end: "17:00" }],
      };
    }
    const now = new Date();

    const defaultAvailability: AvailabilityProps = {
      id: `avb-${uuid()}`,
      lawyer_id: defaultSlots?.lawyer_id || "",
      monday: defaultSlots?.monday || setDefaultDay("monday"),
      tuesday: defaultSlots?.tuesday || setDefaultDay("tuesday"),
      wednesday: defaultSlots?.wednesday || setDefaultDay("wednesday"),
      thursday: defaultSlots?.thursday || setDefaultDay("thursday"),
      friday: defaultSlots?.friday || setDefaultDay("friday"),
      saturday: defaultSlots?.saturday || setDefaultDay("saturday"),
      sunday: defaultSlots?.sunday || setDefaultDay("sunday"),
      createdAt: defaultSlots?.createdAt || now,
      updatedAt: defaultSlots?.updatedAt || now,
    };

    return new Availability(defaultAvailability);
  }

  static fromPersistence(availability: AvailabilityProps): Availability {
    return new Availability(availability);
  }

  get id() {
    return this._id;
  }
  get lawyer_id() {
    return this._lawyer_id;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }

  getDayAvailability(day: Daytype): DayAvailability {
    return this[`_${day}`];
  }

  enableDay(day: Daytype): void {
    this[`_${day}`].enabled = true;
  }

  disableDay(day: Daytype): void {
    this[`_${day}`].enabled = false;
    this[`_${day}`].timeSlots = [];
  }

  addTimeSlot(day: Daytype, slot: TimeSlot): void {
    this[`_${day}`].timeSlots.push(slot);
  }

  removeTimeSlot(day: Daytype, index: number): void {
    this[`_${day}`].timeSlots.splice(index, 1);
  }

  clearTimeSlots(day: Daytype): void {
    this[`_${day}`].timeSlots = [];
  }

  updateTimeSlots(day: Daytype, slots: TimeSlot[]): void {
    this[`_${day}`].timeSlots = slots;
  }
}
