import { IMapper } from "@infrastructure/Mapper/IMapper";
import { Notification } from "../../../domain/entities/Notification";
import { INotificationRepo } from "../../../domain/IRepository/INotificationRepo";
import {
  INotificationModel,
  NotificationModel,
} from "../model/NotificationModel";
import { NotificationMapper } from "@infrastructure/Mapper/Implementations/NotificationMapper";

export class NotificationRepository implements INotificationRepo {
  constructor(
    private mapper: IMapper<
      Notification,
      INotificationModel
    > = new NotificationMapper()
  ) {}
  async addNotification(notification: Notification): Promise<Notification> {
    const newNotification = new NotificationModel(
      this.mapper.toPersistence(notification)
    );
    newNotification.save();
    return this.mapper.toDomain(newNotification);
  }
  async getNotification(receipntId: string): Promise<Notification | null> {
    const notification = await NotificationModel.findOne({
      recipientId: receipntId,
    });
    return notification ? this.mapper.toDomain(notification) : null;
  }
  async findById(id: string): Promise<Notification | null> {
    const data = await NotificationModel.findOne({ _id: id });
    return data ? this.mapper.toDomain(data) : null;
  }
  async updateStatusById(
    id: string,
    status: boolean
  ): Promise<Notification | null> {
    const updated = await NotificationModel.findOneAndUpdate(
      { _id: id },
      { isRead: status },
      { new: true }
    );
    return updated ? this.mapper.toDomain(updated) : null;
  }

  async findAllByUserId({
    cursor,
    userId,
  }: {
    userId: string;
    cursor: number;
  }): Promise<{ data: Notification[] | []; nextCursor?: number }> {
    const limit = 10;
    const skip = cursor > 0 ? (cursor - 1) * limit : 0;
    const notifications = await NotificationModel.find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(10 + 1);
    const hasNextPage = notifications.length > limit;
    const data = hasNextPage ? notifications.slice(0, limit) : notifications;
    return {
      data:
        this.mapper.toDomainArray && data
          ? this.mapper.toDomainArray(data)
          : [],
      nextCursor: hasNextPage ? cursor + 1 : undefined,
    };
  }

  async updateAllByReceiverId(receiverId: string): Promise<void> {
    await NotificationModel.updateMany(
      {
        recipientId: receiverId,
      },
      { isRead: true },
      { new: true }
    );
  }
}
