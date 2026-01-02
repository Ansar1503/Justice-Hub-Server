"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkAllNotificationAsReadComposer = MarkAllNotificationAsReadComposer;
const NotificationRepo_1 = require("@infrastructure/database/repo/NotificationRepo");
const MarkAllNotificationAsReadController_1 = require("@interfaces/controller/Notification/MarkAllNotificationAsReadController");
const MarkAllNotificationAsRead_1 = require("@src/application/usecases/Notification/implementation/MarkAllNotificationAsRead");
function MarkAllNotificationAsReadComposer() {
    const usecase = new MarkAllNotificationAsRead_1.MarkAllNotificationAsReadUseCase(new NotificationRepo_1.NotificationRepository());
    return new MarkAllNotificationAsReadController_1.MarkAllNotificationAsReadController(usecase);
}
