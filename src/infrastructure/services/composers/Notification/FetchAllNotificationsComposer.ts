import { NotificationRepository } from "@infrastructure/database/repo/NotificationRepo";
import { IController } from "@interfaces/controller/Interface/IController";
import { FetchAllNotificationsController } from "@interfaces/controller/Notification/FetchAllNotifications";
import { FetchAllNotificationsUseCase } from "@src/application/usecases/Notification/implementation/FetchAllNotificationsUseCase";

export function FetchAllNotificationsComposer(): IController {
    const usecase = new FetchAllNotificationsUseCase(new NotificationRepository());
    return new FetchAllNotificationsController(usecase);
}
