import { Notification } from "../../../domain/entities/Notification.entity";
import { INotificationRepo } from "../../../domain/IRepository/INotificationRepo";
import { NotificationModel } from "../model/Notfication";

export class NotificationRepo implements INotificationRepo {
  async addNotification(notification: Notification): Promise<Notification> {
    const newNotification = new NotificationModel(notification);
    newNotification.save();
    return newNotification;
  }
  async getNotification(receipntId: string): Promise<Notification | null> {
    const notification = await NotificationModel.findOne({
      recipientId: receipntId,
    });
    return notification;
  }
}
