import { LawyerVerificationMapper } from "@infrastructure/Mapper/Implementations/LawyerVerificaitionMapper";
import { AppointmentsRepository } from "@infrastructure/database/repo/AppointmentsRepo";
import { AvailableSlotRepository } from "@infrastructure/database/repo/AvailableSlotsRepo";
import { LawyerVerificationRepo } from "@infrastructure/database/repo/LawyerVerificationRepo";
import { OverrideSlotsRepository } from "@infrastructure/database/repo/OverrideSlotsRepo";
import { ScheduleSettingsRepository } from "@infrastructure/database/repo/ScheduleSettingsRepo";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { FetchLawyerCalendarAvailabilityController } from "@interfaces/controller/Client/FetchLawyerCalendarAvailabilityController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FetchLawyerCalendarAvailabilityUseCase } from "@src/application/usecases/Client/implementations/FetchAvailableSlotsForBookingUsecase";

export function FetchLawyerCalendarAvailabilityComposer(): IController {
  const usecase = new FetchLawyerCalendarAvailabilityUseCase(
    new UserRepository(),
    new LawyerVerificationRepo(new LawyerVerificationMapper()),
    new ScheduleSettingsRepository(),
    new AvailableSlotRepository(),
    new OverrideSlotsRepository(),
    new AppointmentsRepository()
  );
  return new FetchLawyerCalendarAvailabilityController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
