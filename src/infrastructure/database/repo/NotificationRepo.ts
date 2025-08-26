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
      { status: status },
      { new: true }
    );
    return updated ? this.mapper.toDomain(updated) : null;
  }

  async findAllByUserId(userId: string): Promise<Notification[] | []> {
    const data = await NotificationModel.find({ userId: userId })
      .limit(10)
      .sort({ createdAt: -1 });
    return data && this.mapper.toDomainArray
      ? this.mapper.toDomainArray(data)
      : [];
  }
}
