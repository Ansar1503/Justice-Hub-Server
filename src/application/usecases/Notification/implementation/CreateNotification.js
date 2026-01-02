"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationUsecase = void 0;
const DateAndTimeHelper_1 = require("@shared/utils/helpers/DateAndTimeHelper");
const Notification_1 = require("../../../../domain/entities/Notification");
const CustomError_1 = require("../../../../interfaces/middelwares/Error/CustomError");
class NotificationUsecase {
    _notificationRep;
    _sessionRepo;
    _chatSessionRepo;
    _appointmentRepo;
    _userSubRepo;
    constructor(_notificationRep, _sessionRepo, _chatSessionRepo, _appointmentRepo, _userSubRepo) {
        this._notificationRep = _notificationRep;
        this._sessionRepo = _sessionRepo;
        this._chatSessionRepo = _chatSessionRepo;
        this._appointmentRepo = _appointmentRepo;
        this._userSubRepo = _userSubRepo;
    }
    async execute(input) {
        if (input.type === "session") {
            const session = await this._sessionRepo.findById({
                session_id: input.sessionId || "",
            });
            if (!session)
                throw new CustomError_1.ValidationError("Session not found");
            const appointmentDetails = await this._appointmentRepo.findByBookingId(session.bookingId);
            if (!appointmentDetails)
                throw new Error("Appointment not found");
            const startTime = (0, DateAndTimeHelper_1.timeStringToDate)(appointmentDetails.date, appointmentDetails.time);
            startTime.setMinutes(startTime.getMinutes() + appointmentDetails.duration + 5);
            const newDate = new Date();
            if (newDate < startTime) {
                throw new CustomError_1.ValidationError("Session has not started yet");
            }
            if (newDate > startTime) {
                throw new CustomError_1.ValidationError("Session has ended");
            }
        }
        else {
            const chatSession = await this._chatSessionRepo.findById(input.sessionId || "");
            if (!chatSession)
                throw new CustomError_1.ValidationError("Chat Session not found");
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
        console.log("input", input);
        const newNotificationPayload = Notification_1.Notification.create({
            message: input.message,
            recipientId: input.recipientId,
            sessionId: input.sessionId,
            senderId: input.senderId,
            title: input.title,
            type: input.type,
            roomId: input.roomId,
        });
        const newNotification = await this._notificationRep.addNotification(newNotificationPayload);
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
exports.NotificationUsecase = NotificationUsecase;
