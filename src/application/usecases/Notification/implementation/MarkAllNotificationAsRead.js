"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkAllNotificationAsReadUseCase = void 0;
class MarkAllNotificationAsReadUseCase {
    notificationRepo;
    constructor(notificationRepo) {
        this.notificationRepo = notificationRepo;
    }
    async execute(input) {
        await this.notificationRepo.updateAllByReceiverId(input);
    }
}
exports.MarkAllNotificationAsReadUseCase = MarkAllNotificationAsReadUseCase;
