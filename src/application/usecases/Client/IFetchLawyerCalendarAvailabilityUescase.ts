import { CalendarAvailabilityResponseDto } from "@src/application/dtos/client/fetchLawyerCalendarAvailabilityDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchLawyerCalendarAvailabilityUseCase
  extends IUseCase<
    {
      lawyerId: string;
      month?: string;
    },
    CalendarAvailabilityResponseDto
  > {}
