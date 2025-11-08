import { timeStringToDate } from "@shared/utils/helpers/DateAndTimeHelper";
import { IChatSessionRepo } from "@domain/IRepository/IChatSessionRepo";
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";
import { Notification } from "../../../../domain/entities/Notification";
import { ISessionsRepo } from "../../../../domain/IRepository/ISessionsRepo";
import { INotificationRepo } from "../../../../domain/IRepository/INotificationRepo";
import { ValidationError } from "../../../../interfaces/middelwares/Error/CustomError";
import { NotificationDto } from "../../../dtos/Notification/BaseNotification";
import { ICreateNotification } from "../ICreateNotification";
import { IUserSubscriptionRepo } from "@domain/IRepository/IUserSubscriptionRepo";

export class NotificationUsecase implements ICreateNotification {
  constructor(
    private _notificationRep: INotificationRepo,
    private _sessionRepo: ISessionsRepo,
    private _chatSessionRepo: IChatSessionRepo,
    private _appointmentRepo: IAppointmentsRepository,
    private _userSubRepo: IUserSubscriptionRepo
  ) {}

  async execute(input: NotificationDto): Promise<NotificationDto> {
    if (input.type === "session") {
      const session = await this._sessionRepo.findById({
        session_id: input.sessionId || "",
      });
      if (!session) throw new ValidationError("Session not found");
      const appointmentDetails = await this._appointmentRepo.findByBookingId(
        session.bookingId
      );
      if (!appointmentDetails) throw new Error("Appointment not found");
      const startTime = timeStringToDate(
        appointmentDetails.date,
        appointmentDetails.time
      );
      startTime.setMinutes(
        startTime.getMinutes() + appointmentDetails.duration + 5
      );
      const newDate = new Date();
      if (newDate < startTime) {
        throw new ValidationError("Session has not started yet");
      }
      if (newDate > startTime) {
        throw new ValidationError("Session has ended");
      }
    } else {
      const chatSession = await this._chatSessionRepo.findById(
        input.sessionId || ""
      );
      if (!chatSession) throw new ValidationError("Chat Session not found");
      const [ClientSub, lawyerSub] = await Promise.all([
        this._userSubRepo.findByUser(chatSession.participants.client_id),
        this._userSubRepo.findByUser(chatSession.participants.lawyer_id),
      ]);
      if (ClientSub && !ClientSub.benefitsSnapshot.chatAccess) {
        throw new Error("no chat access");
      }
      if (lawyerSub && !lawyerSub.benefitsSnapshot.chatAccess) {
        throw new Error("no chat access");
      }
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

    const newNotification = await this._notificationRep.addNotification(
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
