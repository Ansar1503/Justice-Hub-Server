import { Notification } from "../../domain/entities/Notification";
import { ISessionsRepo } from "../../domain/IRepository/ISessionsRepo";
import { INotificationRepo } from "../../domain/IRepository/INotificationRepo";
import { ValidationError } from "../../interfaces/middelwares/Error/CustomError";
import { INotificationUsecase } from "./IUseCases/INotificationUsecase";

export class NotificationUsecase implements INotificationUsecase {
  constructor(
    private notificationRep: INotificationRepo,
    private sessionRepo: ISessionsRepo
  ) {}
  private timeStringToDate(baseDate: Date, hhmm: string): Date {
    const [h, m] = hhmm.split(":").map(Number);
    const d = new Date(baseDate);
    d.setHours(h, m, 0, 0);
    return d;
  }
  async createSessionNotification(
    payload: Notification
  ): Promise<Notification> {
    const session = await this.sessionRepo.findById({
      session_id: payload.sessionId || "",
    });
    if (!session) throw new ValidationError("Session not found");
    const startTime = this.timeStringToDate(
      session.scheduled_date,
      session.scheduled_time
    );
    const newDate = new Date();
    if (newDate < startTime) {
      throw new ValidationError("Session has not started yet");
    }
    startTime.setMinutes(startTime.getMinutes() + session.duration + 5);
    // if (newDate > startTime) {
    //   throw new ValidationError("Session has ended");
    // }
    const newNotification = await this.notificationRep.addNotification(payload);
    return newNotification;
  }
}
