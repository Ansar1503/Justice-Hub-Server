"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAllNotificationsUseCase = void 0;
class FetchAllNotificationsUseCase {
    notificationRepo;
    constructor(notificationRepo) {
        this.notificationRepo = notificationRepo;
    }
    async execute(input) {
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
exports.FetchAllNotificationsUseCase = FetchAllNotificationsUseCase;
