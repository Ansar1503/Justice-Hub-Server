interface TimeRange {
  start: string;
  end: string;
}

interface OverrideDate {
  date: Date;
  isUnavailable: boolean;
  timeRanges: TimeRange[];
}

export interface OverrideSlotsDto {
  lawyer_id: string;
  overrideDates: OverrideDate[];
}
