import { Notification } from "../../../../domain/entities/Notification";
import { ISessionsRepo } from "../../../../domain/IRepository/ISessionsRepo";
import { INotificationRepo } from "../../../../domain/IRepository/INotificationRepo";
import { ValidationError } from "../../../../interfaces/middelwares/Error/CustomError";
import { NotificationDto } from "../../../dtos/Notification/BaseNotification";
import { timeStringToDate } from "@shared/utils/helpers/DateAndTimeHelper";
import { ICreateNotification } from "../ICreateNotification";
import { IChatSessionRepo } from "@domain/IRepository/IChatSessionRepo";

export class NotificationUsecase implements ICreateNotification {
  constructor(
    private notificationRep: INotificationRepo,
    private sessionRepo: ISessionsRepo,
    private chatSessionRepo: IChatSessionRepo
  ) {}

  async execute(input: NotificationDto): Promise<NotificationDto> {
    if (input.type === "session") {
      const session = await this.sessionRepo.findById({
        session_id: input.sessionId || "",
      });
      if (!session) throw new ValidationError("Session not found");

      const startTime = timeStringToDate(
        session.scheduled_date,
        session.scheduled_time
      );
      startTime.setMinutes(startTime.getMinutes() + session.duration + 5);
      // const newDate = new Date();
      // if (newDate < startTime) {
      //    throw new ValidationError("Session has not started yet");
      //    }
      //  if (newDate > startTime) {
      // throw new ValidationError("Session has ended");
      //  }
    } else {
      const chatSession = await this.chatSessionRepo.findById(
        input.sessionId || ""
      );
      if (!chatSession) throw new ValidationError("Chat Session not found");
    }

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
