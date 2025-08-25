import { NotificationDto } from "@src/application/dtos/Notification/BaseNotification";
import { IUpdateNotificationStatus } from "../IUpdateNotificationStatus";
import { INotificationRepo } from "@domain/IRepository/INotificationRepo";

export class UpdateNotificationStatus implements IUpdateNotificationStatus {
  constructor(private notificationRepo: INotificationRepo) {}

  async execute(input: {
    id: string;
    status: boolean;
  }): Promise<NotificationDto> {
    const notifcationExist = await this.notificationRepo.findById(input.id);
    if (!notifcationExist) {
      throw new Error("Notification not found");
    }
    const notification = await this.notificationRepo.updateStatusById(
      input.id,
      input.status
    );
    return {
      id: notifcationExist.id,
      createdAt: notifcationExist.createdAt,
      isRead: notifcationExist.isRead,
      message: notifcationExist.message,
      recipientId: notifcationExist.recipientId,
      senderId: notifcationExist.senderId,
      title: notifcationExist.title,
      type: notifcationExist.type,
      updatedAt: notifcationExist.updatedAt,
      roomId: notifcationExist.roomId,
      sessionId: notifcationExist.sessionId,
    };
  }
}
