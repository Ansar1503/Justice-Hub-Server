import { IController } from "@interfaces/controller/Interface/IController";
import { HandleWebhookController } from "@interfaces/controller/Client/StripeWebhookController";
import { HandleStripeHookUseCase } from "@src/application/usecases/Client/implementations/HandleStripeHooksUseCase";
import { ScheduleSettingsRepository } from "@infrastructure/database/repo/ScheduleSettingsRepo";
import { MongoUnitofWork } from "@infrastructure/database/UnitofWork/implementations/UnitofWork";

export function HandleWebhookComposer(): IController {
  const usecase = new HandleStripeHookUseCase(
    new ScheduleSettingsRepository(),
    new MongoUnitofWork()
  );
  return new HandleWebhookController(usecase);
}
