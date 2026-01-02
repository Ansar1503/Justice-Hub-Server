"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNotificationStatusComposer = UpdateNotificationStatusComposer;
const NotificationRepo_1 = require("@infrastructure/database/repo/NotificationRepo");
const UpdateNotificationStatusController_1 = require("@interfaces/controller/Notification/UpdateNotificationStatusController");
const UpdateNotificationStatus_1 = require("@src/application/usecases/Notification/implementation/UpdateNotificationStatus");
function UpdateNotificationStatusComposer() {
    const usecase = new UpdateNotificationStatus_1.UpdateNotificationStatus(new NotificationRepo_1.NotificationRepository());
    return new UpdateNotificationStatusController_1.UpdateNotificationStatusController(usecase);
}
