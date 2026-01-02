"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationMapper = void 0;
const Notification_1 = require("@domain/entities/Notification");
class NotificationMapper {
    toDomain(persistence) {
        return Notification_1.Notification.fromPersistence({
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
    toDomainArray(persistence) {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity) {
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
exports.NotificationMapper = NotificationMapper;
