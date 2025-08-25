import { Notification } from "../../../../domain/entities/Notification";
import { ISessionsRepo } from "../../../../domain/IRepository/ISessionsRepo";
import { INotificationRepo } from "../../../../domain/IRepository/INotificationRepo";
import { ValidationError } from "../../../../interfaces/middelwares/Error/CustomError";
import { NotificationDto } from "../../../dtos/Notification/BaseNotification";
import { timeStringToDate } from "@shared/utils/helpers/DateAndTimeHelper";
import { ICreateNotification } from "../ICreateNotification";

export class NotificationUsecase implements ICreateNotification {
  constructor(
    private notificationRep: INotificationRepo,
    private sessionRepo: ISessionsRepo
  ) {}

  async execute(input: NotificationDto): Promise<NotificationDto> {
    const session = await this.sessionRepo.findById({
      session_id: input.sessionId || "",
    });
    if (!session) throw new ValidationError("Session not found");
    const startTime = timeStringToDate(
      session.scheduled_date,
      session.scheduled_time
    );
    const newDate = new Date();
    // if (newDate < startTime) {
    //   throw new ValidationError("Session has not started yet");
    // }
    startTime.setMinutes(startTime.getMinutes() + session.duration + 5);
    // if (newDate > startTime) {
    //   throw new ValidationError("Session has ended");
    // }
    const newNotificationPayload = Notification.create({
      message: input.message,
      recipientId: input.recipientId,
      sessionId: input.sessionId,
      senderId: input.senderId,
      title: input.title,
      type: input.type,
      roomId: input.roomId,
    });
    const newNotification = await this.notificationRep.addNotification(
      newNotificationPayload
    );
    return {
      createdAt: newNotification.createdAt,
      id: newNotification.id,
      isRead: newNotification.isRead,
      message: newNotification.message,
      recipientId: newNotification.recipientId,
      senderId: newNotification.senderId,
      title: newNotification.title,
      type: newNotification.type,
      roomId: newNotification.roomId,
      sessionId: newNotification.sessionId,
      updatedAt: newNotification.updatedAt,
    };
  }
}
