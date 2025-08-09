import { GetLawyerSlotDetailsController } from "@interfaces/controller/Client/GetLawyerSlotDetailsController";
import { FetchLawyerSlotsUseCase } from "@src/application/usecases/Client/implementations/FetchLawyerSlotsUseCase";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { LawyerRepository } from "@infrastructure/database/repo/LawyerRepo";
import { ScheduleSettingsRepository } from "@infrastructure/database/repo/ScheduleSettingsRepo";
import { AppointmentsRepository } from "@infrastructure/database/repo/AppointmentsRepo";
import { OverrideSlotsRepository } from "@infrastructure/database/repo/OverrideSlotsRepo";
import { AvailableSlotRepository } from "@infrastructure/database/repo/AvailableSlotsRepo";

export const GetLawyerSlotDetailsComposer = () => {
  const useCase = new FetchLawyerSlotsUseCase(
    new UserRepository(),
    new LawyerRepository(),
    new ScheduleSettingsRepository(),
    new AppointmentsRepository(),
    new OverrideSlotsRepository(),
    new AvailableSlotRepository()
  );
  return new GetLawyerSlotDetailsController(useCase);
};
