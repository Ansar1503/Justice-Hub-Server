import { NotificationRepository } from "@infrastructure/database/repo/NotificationRepo";
import { IController } from "@interfaces/controller/Interface/IController";
import { UpdateNotificationStatusController } from "@interfaces/controller/Notification/UpdateNotificationStatusController";
import { UpdateNotificationStatus } from "@src/application/usecases/Notification/implementation/UpdateNotificationStatus";

export function UpdateNotificationStatusComposer(): IController {
    const usecase = new UpdateNotificationStatus(new NotificationRepository());
    return new UpdateNotificationStatusController(usecase);
}
