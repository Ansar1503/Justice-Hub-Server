import { Notification } from "../../../domain/entities/Notification.entity";

export interface INotificationUsecase {
  createSessionNotification(payload: Notification): Promise<Notification>;
}
