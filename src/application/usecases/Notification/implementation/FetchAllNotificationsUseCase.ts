import { NotificationDto } from "@src/application/dtos/Notification/BaseNotification";
import { IFetchAllNotificationsUseCase } from "../IFetchAllNotificationsUseCase";
import { INotificationRepo } from "@domain/IRepository/INotificationRepo";

export class FetchAllNotificationsUseCase
  implements IFetchAllNotificationsUseCase
{
  constructor(private notificationRepo: INotificationRepo) {}
  async execute(input: { user_id: string }): Promise<NotificationDto[] | []> {
    const notification = await this.notificationRepo.findAllByUserId(
      input.user_id
    );
    if (!notification) return [];
    return notification.map((n) => ({
      createdAt: n.createdAt,
      id: n.id,
      isRead: n.isRead,
      message: n.message,
      recipientId: n.recipientId,
      senderId: n.senderId,
      type: n.type,
      title: n.title,
      updatedAt: n.updatedAt,
      roomId: n.roomId,
      sessionId: n.sessionId,
    }));
  }
}
