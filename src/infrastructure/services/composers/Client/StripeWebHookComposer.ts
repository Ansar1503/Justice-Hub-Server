import { IController } from "@interfaces/controller/Interface/IController";
import { HandleWebhookController } from "@interfaces/controller/Client/StripeWebhookController";
import { HandleStripeHookUseCase } from "@src/application/usecases/Client/implementations/HandleStripeHooksUseCase";
import { ScheduleSettingsRepository } from "@infrastructure/database/repo/ScheduleSettingsRepo";
import { MongoUnitofWork } from "@infrastructure/database/UnitofWork/implementations/UnitofWork";
import { RedisService } from "@infrastructure/Redis/RedisService";
import { connectRedis } from "@infrastructure/Redis/Config/RedisConfig";

export async function HandleWebhookComposer(): Promise<IController> {
  const client = await connectRedis();
  const usecase = new HandleStripeHookUseCase(
    new ScheduleSettingsRepository(),
    new MongoUnitofWork(),
    new RedisService(client),
  );
  return new HandleWebhookController(usecase);
}
