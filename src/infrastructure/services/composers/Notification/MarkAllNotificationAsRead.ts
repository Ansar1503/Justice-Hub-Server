import { NotificationRepository } from "@infrastructure/database/repo/NotificationRepo";
import { IController } from "@interfaces/controller/Interface/IController";
import { MarkAllNotificationAsReadController } from "@interfaces/controller/Notification/MarkAllNotificationAsReadController";
import { MarkAllNotificationAsReadUseCase } from "@src/application/usecases/Notification/implementation/MarkAllNotificationAsRead";

export function MarkAllNotificationAsReadComposer(): IController {
  const usecase = new MarkAllNotificationAsReadUseCase(
    new NotificationRepository()
  );
  return new MarkAllNotificationAsReadController(usecase);
}
