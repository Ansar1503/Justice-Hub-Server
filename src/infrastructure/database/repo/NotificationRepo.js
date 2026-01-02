"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const NotificationMapper_1 = require("@infrastructure/Mapper/Implementations/NotificationMapper");
const NotificationModel_1 = require("../model/NotificationModel");
class NotificationRepository {
    mapper;
    constructor(mapper = new NotificationMapper_1.NotificationMapper()) {
        this.mapper = mapper;
    }
    async addNotification(notification) {
        const newNotification = new NotificationModel_1.NotificationModel(this.mapper.toPersistence(notification));
        newNotification.save();
        return this.mapper.toDomain(newNotification);
    }
    async getNotification(receipntId) {
        const notification = await NotificationModel_1.NotificationModel.findOne({
            recipientId: receipntId,
        });
        return notification ? this.mapper.toDomain(notification) : null;
    }
    async findById(id) {
        const data = await NotificationModel_1.NotificationModel.findOne({ _id: id });
        return data ? this.mapper.toDomain(data) : null;
    }
    async updateStatusById(id, status) {
        const updated = await NotificationModel_1.NotificationModel.findOneAndUpdate({ _id: id }, { isRead: status }, { new: true });
        return updated ? this.mapper.toDomain(updated) : null;
    }
    async findAllByUserId({ cursor, userId, }) {
        const limit = 10;
        const skip = cursor > 0 ? (cursor - 1) * limit : 0;
        const notifications = await NotificationModel_1.NotificationModel.find({ recipientId: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(10 + 1);
        const hasNextPage = notifications.length > limit;
        const data = hasNextPage ? notifications.slice(0, limit) : notifications;
        return {
            data: this.mapper.toDomainArray && data ? this.mapper.toDomainArray(data) : [],
            nextCursor: hasNextPage ? cursor + 1 : undefined,
        };
    }
    async updateAllByReceiverId(receiverId) {
        await NotificationModel_1.NotificationModel.updateMany({
            recipientId: receiverId,
        }, { isRead: true }, { new: true });
    }
}
exports.NotificationRepository = NotificationRepository;
