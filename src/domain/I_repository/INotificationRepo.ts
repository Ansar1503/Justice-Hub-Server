import { Notification } from "../entities/Notification.entity";

export interface INotificationRepo {
  addNotification(notification: Notification): Promise<Notification>;
  getNotification(receipntId: string): Promise<Notification | null>;
}
