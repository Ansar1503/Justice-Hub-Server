import { IController } from "@interfaces/controller/Interface/IController";
import { HandleWebhookController } from "@interfaces/controller/Client/StripeWebhookController";
import { HandleStripeHookUseCase } from "@src/application/usecases/Client/implementations/HandleStripeHooksUseCase";
import { ScheduleSettingsRepository } from "@infrastructure/database/repo/ScheduleSettingsRepo";
import { AppointmentsRepository } from "@infrastructure/database/repo/AppointmentsRepo";

export function HandleWebhookComposer(): IController {
  const usecase = new HandleStripeHookUseCase(
    new ScheduleSettingsRepository(),
    new AppointmentsRepository()
  );
  return new HandleWebhookController(usecase);
}
