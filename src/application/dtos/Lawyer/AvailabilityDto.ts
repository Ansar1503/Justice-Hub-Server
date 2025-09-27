interface TimeSlot {
    start: string;
    end: string;
}

interface DayAvailability {
    enabled: boolean;
    timeSlots: TimeSlot[];
}

export interface AvailabilityInputDto {
    lawyer_id: string;
    monday: DayAvailability;
    tuesday: DayAvailability;
    wednesday: DayAvailability;
    thursday: DayAvailability;
    friday: DayAvailability;
    saturday: DayAvailability;
    sunday: DayAvailability;
}

export interface AvailabilityOutputDto {
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
