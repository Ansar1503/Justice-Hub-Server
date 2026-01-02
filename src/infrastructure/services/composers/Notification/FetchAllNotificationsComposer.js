"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAllNotificationsComposer = FetchAllNotificationsComposer;
const NotificationRepo_1 = require("@infrastructure/database/repo/NotificationRepo");
const FetchAllNotifications_1 = require("@interfaces/controller/Notification/FetchAllNotifications");
const FetchAllNotificationsUseCase_1 = require("@src/application/usecases/Notification/implementation/FetchAllNotificationsUseCase");
function FetchAllNotificationsComposer() {
    const usecase = new FetchAllNotificationsUseCase_1.FetchAllNotificationsUseCase(new NotificationRepo_1.NotificationRepository());
    return new FetchAllNotifications_1.FetchAllNotificationsController(usecase);
}
