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
}
