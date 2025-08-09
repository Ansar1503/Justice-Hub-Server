import { Notification } from "../../../domain/entities/Notification";

export interface INotificationUsecase {
  createSessionNotification(payload: Notification): Promise<Notification>;
}
