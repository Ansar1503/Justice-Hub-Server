import { CreateCheckoutSessionController } from "@interfaces/controller/Client/Sessions/CreateCheckoutSessionController";
import { CreateCheckoutSessionUseCase } from "@src/application/usecases/Client/implementations/CreateChekoutSessionUseCase";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { LawyerRepository } from "@infrastructure/database/repo/LawyerRepo";
import { AppointmentsRepository } from "@infrastructure/database/repo/AppointmentsRepo";
import { ScheduleSettingsRepository } from "@infrastructure/database/repo/ScheduleSettingsRepo";
import { AvailableSlotRepository } from "@infrastructure/database/repo/AvailableSlotsRepo";
import { OverrideSlotsRepository } from "@infrastructure/database/repo/OverrideSlotsRepo";
import { WalletRepo } from "@infrastructure/database/repo/WalletRepo";
import { LawyerVerificationRepo } from "@infrastructure/database/repo/LawyerVerificationRepo";
import { LawyerVerificationMapper } from "@infrastructure/Mapper/Implementations/LawyerVerificaitionMapper";
import { RedisService } from "@infrastructure/Redis/RedisService";
import { connectRedis } from "@infrastructure/Redis/Config/RedisConfig";

export const CreateCheckoutSessionComposer = async () => {
  const client = await connectRedis();
  const useCase = new CreateCheckoutSessionUseCase(
    new UserRepository(),
    new LawyerVerificationRepo(new LawyerVerificationMapper()),
    new AppointmentsRepository(),
    new ScheduleSettingsRepository(),
    new AvailableSlotRepository(),
    new OverrideSlotsRepository(),
    new WalletRepo(),
    new LawyerRepository(),
    new RedisService(client)
  );
  return new CreateCheckoutSessionController(useCase);
};
