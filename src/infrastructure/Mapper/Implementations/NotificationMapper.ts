import { Notification } from "@domain/entities/Notification";
import { INotificationModel } from "@infrastructure/database/model/NotificationModel";
import { IMapper } from "../IMapper";

export class NotificationMapper implements IMapper<Notification, INotificationModel> {
    toDomain(persistence: INotificationModel): Notification {
        return Notification.fromPersistence({
            id: persistence._id.toString(),
            sessionId: persistence.sessionId,
            senderId: persistence.senderId,
            recipientId: persistence.recipientId,
            isRead: persistence.isRead,
            message: persistence.message,
            title: persistence.title,
            type: persistence.type,
            roomId: persistence.roomId,
            createdAt: persistence.createdAt,
            updatedAt: persistence.updatedAt,
        });
    }
    toDomainArray(persistence: INotificationModel[]): Notification[] {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity: Notification): Partial<INotificationModel> {
        return {
            _id: entity.id.toString(),
            sessionId: entity.sessionId,
            senderId: entity.senderId,
            recipientId: entity.recipientId,
            isRead: entity.isRead,
            message: entity.message,
            title: entity.title,
            type: entity.type,
            roomId: entity.roomId,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
