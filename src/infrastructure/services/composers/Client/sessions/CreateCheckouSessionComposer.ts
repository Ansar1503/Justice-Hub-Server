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
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { CommissionSettingsRepo } from "@infrastructure/database/repo/CommissionSettingsRepo";
import { CommissionSettingsMapper } from "@infrastructure/Mapper/Implementations/CommissionSettingsMapper";
import { UserSubscriptionRepository } from "@infrastructure/database/repo/UserSubscriptionRepository";
import { UserSubscriptionMapper } from "@infrastructure/Mapper/Implementations/UserSubscriptionMapper";
import { SessionsRepository } from "@infrastructure/database/repo/SessionRepo";

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
    new RedisService(client),
    new CommissionSettingsRepo(new CommissionSettingsMapper()),
    new UserSubscriptionRepository(new UserSubscriptionMapper()),
    new SessionsRepository()
  );
  return new CreateCheckoutSessionController(
    useCase,
    new HttpErrors(),
    new HttpSuccess()
  );
};
