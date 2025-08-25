import { NotificationDto } from "@src/application/dtos/Notification/BaseNotification";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IUpdateNotificationStatus
  extends IUseCase<{ id: string; status: boolean }, NotificationDto> {}
