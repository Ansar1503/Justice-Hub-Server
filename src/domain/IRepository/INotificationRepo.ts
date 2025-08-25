import { Notification } from "../entities/Notification";

export interface INotificationRepo {
  addNotification(notification: Notification): Promise<Notification>;
  getNotification(receipntId: string): Promise<Notification | null>;
  findById(id: string): Promise<Notification | null>;
  updateStatusById(id: string, status: boolean): Promise<Notification | null>;
}
