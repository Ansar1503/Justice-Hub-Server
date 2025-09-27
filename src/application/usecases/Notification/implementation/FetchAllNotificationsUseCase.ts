import { NotificationDto } from "@src/application/dtos/Notification/BaseNotification";
import { IFetchAllNotificationsUseCase } from "../IFetchAllNotificationsUseCase";
import { INotificationRepo } from "@domain/IRepository/INotificationRepo";

export class FetchAllNotificationsUseCase
implements IFetchAllNotificationsUseCase
{
    constructor(private notificationRepo: INotificationRepo) {}
    async execute(input: {
    user_id: string;
    cursor: number;
  }): Promise<{ data: NotificationDto[] | []; nextCursor?: number }> {
        console.log("input",input);
        const notification = await this.notificationRepo.findAllByUserId({
            userId: input.user_id,
            cursor: input.cursor,
        });

        return {
            data: notification?.data
                ? notification.data.map((n) => ({
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
                }))
                : [],
            nextCursor: notification.nextCursor,
        };
    }
}
