export interface CalendarAvailabilityResponseDto {
  lawyerId: string;
  month: string;
  availableDates: {
    date: string;
    isAvailable: boolean;
    timeRanges: {
      start: string;
      end: string;
      availableSlots: number;
    }[];
  }[];
  slotDuration: number;
  maxDaysInAdvance: number;
}
