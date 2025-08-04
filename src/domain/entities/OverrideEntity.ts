interface OverrideDate {
  date: Date;
  isUnavailable: boolean;
  timeRanges?: { start: string; end: string }[];
}

interface OverrideSlots {
  id: string;
  lawyer_id: string;
  overrideDates: OverrideDate[];
}

export class Override {
  private _id: string;
  private _lawyer_id: string;
  private _overrideDates: OverrideDate[];

  constructor(private props: OverrideSlots) {
    (this._id = props.id),
      (this._lawyer_id = props.lawyer_id),
      (this._overrideDates = props.overrideDates);
  }
}
