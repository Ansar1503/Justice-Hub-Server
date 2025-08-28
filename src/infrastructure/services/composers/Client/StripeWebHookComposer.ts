import { IController } from "@interfaces/controller/Interface/IController";
import { HandleWebhookController } from "@interfaces/controller/Client/StripeWebhookController";
import { HandleStripeHookUseCase } from "@src/application/usecases/Client/implementations/HandleStripeHooksUseCase";
import { ScheduleSettingsRepository } from "@infrastructure/database/repo/ScheduleSettingsRepo";
import { AppointmentsRepository } from "@infrastructure/database/repo/AppointmentsRepo";
import { WalletRepo } from "@infrastructure/database/repo/WalletRepo";
import { WalletTransactionsRepo } from "@infrastructure/database/repo/WalletTransactionsRepo";

export function HandleWebhookComposer(): IController {
  const usecase = new HandleStripeHookUseCase(
    new ScheduleSettingsRepository(),
    new AppointmentsRepository(),
    new WalletRepo(),
    new WalletTransactionsRepo()
  );
  return new HandleWebhookController(usecase);
}
