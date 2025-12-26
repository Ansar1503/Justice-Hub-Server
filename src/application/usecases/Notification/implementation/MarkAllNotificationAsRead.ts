import { INotificationRepo } from "@domain/IRepository/INotificationRepo";
import { IMarkAllNotificationAsRead } from "../IMarkAllNotificationAsRead";

export class MarkAllNotificationAsReadUseCase implements IMarkAllNotificationAsRead {
    constructor(private _notificationRepo: INotificationRepo) {}
    async execute(input: string): Promise<void> {
        await this._notificationRepo.updateAllByReceiverId(input);
    }
}
