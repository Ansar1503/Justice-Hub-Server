import { GetLawyerSlotDetailsController } from "@interfaces/controller/Client/GetLawyerSlotDetailsController";
import { FetchLawyerSlotsUseCase } from "@src/application/usecases/Client/implementations/FetchLawyerSlotsUseCase";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { ScheduleSettingsRepository } from "@infrastructure/database/repo/ScheduleSettingsRepo";
import { AppointmentsRepository } from "@infrastructure/database/repo/AppointmentsRepo";
import { OverrideSlotsRepository } from "@infrastructure/database/repo/OverrideSlotsRepo";
import { AvailableSlotRepository } from "@infrastructure/database/repo/AvailableSlotsRepo";
import { LawyerVerificationRepo } from "@infrastructure/database/repo/LawyerVerificationRepo";
import { LawyerVerificationMapper } from "@infrastructure/Mapper/Implementations/LawyerVerificaitionMapper";

export const GetLawyerSlotDetailsComposer = () => {
  const useCase = new FetchLawyerSlotsUseCase(
    new UserRepository(),
    new LawyerVerificationRepo(new LawyerVerificationMapper()),
    new ScheduleSettingsRepository(),
    new AppointmentsRepository(),
    new OverrideSlotsRepository(),
    new AvailableSlotRepository()
  );
  return new GetLawyerSlotDetailsController(useCase);
};
