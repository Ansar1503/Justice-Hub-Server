import { NotificationDto } from "@src/application/dtos/Notification/BaseNotification";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchAllNotificationsUseCase
  extends IUseCase<{ user_id: string }, NotificationDto[] | []> {}
