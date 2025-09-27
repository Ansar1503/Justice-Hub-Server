import { NotificationDto } from "@src/application/dtos/Notification/BaseNotification";
import { IUseCase } from "../IUseCases/IUseCase";

export interface ICreateNotification extends IUseCase<NotificationDto, NotificationDto> {}
