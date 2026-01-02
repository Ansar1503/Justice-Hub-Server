"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNotificationStatus = void 0;
class UpdateNotificationStatus {
    notificationRepo;
    constructor(notificationRepo) {
        this.notificationRepo = notificationRepo;
    }
    async execute(input) {
        const notifcationExist = await this.notificationRepo.findById(input.id);
        if (!notifcationExist) {
            throw new Error("Notification not found");
        }
        await this.notificationRepo.updateStatusById(input.id, input.status);
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
exports.UpdateNotificationStatus = UpdateNotificationStatus;
