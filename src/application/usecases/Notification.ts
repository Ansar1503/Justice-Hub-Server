import { Notification } from "../../domain/entities/Notification";
import { ISessionsRepo } from "../../domain/IRepository/ISessionsRepo";
import { INotificationRepo } from "../../domain/IRepository/INotificationRepo";
import { ValidationError } from "../../interfaces/middelwares/Error/CustomError";
import { INotificationUsecase } from "./IUseCases/INotificationUsecase";
import { NotificationDto } from "../dtos/Notification";
import { timeStringToDate } from "@shared/utils/helpers/DateAndTimeHelper";

export class NotificationUsecase implements INotificationUsecase {
  constructor(
    private notificationRep: INotificationRepo,
    private sessionRepo: ISessionsRepo
  ) {}

  async createSessionNotification(
    payload: Notification
  ): Promise<NotificationDto> {
    const session = await this.sessionRepo.findById({
      session_id: payload.sessionId || "",
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
      message: payload.message,
      recipientId: payload.recipientId,
      sessionId: payload.sessionId,
      senderId: payload.senderId,
      title: payload.title,
      type: payload.type,
      roomId: payload.roomId,
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
