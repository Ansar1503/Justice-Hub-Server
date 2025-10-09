import { AppointmentsRepository } from "@infrastructure/database/repo/AppointmentsRepo";
import { AvailableSlotRepository } from "@infrastructure/database/repo/AvailableSlotsRepo";
import { CommissionSettingsRepo } from "@infrastructure/database/repo/CommissionSettingsRepo";
import { LawyerRepository } from "@infrastructure/database/repo/LawyerRepo";
import { LawyerVerificationRepo } from "@infrastructure/database/repo/LawyerVerificationRepo";
import { OverrideSlotsRepository } from "@infrastructure/database/repo/OverrideSlotsRepo";
import { ScheduleSettingsRepository } from "@infrastructure/database/repo/ScheduleSettingsRepo";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { WalletRepo } from "@infrastructure/database/repo/WalletRepo";
import { CommissionSettingsMapper } from "@infrastructure/Mapper/Implementations/CommissionSettingsMapper";
import { LawyerVerificationMapper } from "@infrastructure/Mapper/Implementations/LawyerVerificaitionMapper";
import { connectRedis } from "@infrastructure/Redis/Config/RedisConfig";
import { RedisService } from "@infrastructure/Redis/RedisService";
import { CreateFollowupCheckoutSessionController } from "@interfaces/controller/Client/Sessions/CreateFollowupSessionController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { CreateFollowupCheckoutSessionUsecase } from "@src/application/usecases/Client/implementations/CreateFollowupSessionUsecase";

export async function CreateFollowupCheckoutSessionComposer() {
  const client = await connectRedis();
  const usecase = new CreateFollowupCheckoutSessionUsecase(
    new UserRepository(),
    new LawyerVerificationRepo(new LawyerVerificationMapper()),
    new AppointmentsRepository(),
    new ScheduleSettingsRepository(),
    new AvailableSlotRepository(),
    new OverrideSlotsRepository(),
    new WalletRepo(),
    new LawyerRepository(),
    new RedisService(client),
    new CommissionSettingsRepo(new CommissionSettingsMapper())
  );
  return new CreateFollowupCheckoutSessionController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
