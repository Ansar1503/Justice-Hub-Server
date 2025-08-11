export interface ScheduleSettingsOutputDto {
  id: string;
  lawyer_id: string;
  slotDuration: number;
  maxDaysInAdvance: number;
  autoConfirm: boolean;
  createdAt: Date;
  updatedAt: Date;
}
