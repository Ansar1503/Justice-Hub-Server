"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmClientAppointmentComposer = ConfirmClientAppointmentComposer;
const ConfirmClientAppointmentController_1 = require("@interfaces/controller/Lawyer/Appointments/ConfirmClientAppointmentController");
const ConfirmAppointmentUseCase_1 = require("@src/application/usecases/Lawyer/implementations/ConfirmAppointmentUseCase");
const AppointmentsRepo_1 = require("@infrastructure/database/repo/AppointmentsRepo");
const SessionRepo_1 = require("@infrastructure/database/repo/SessionRepo");
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const ChatSessionRepo_1 = require("@infrastructure/database/repo/ChatSessionRepo");
function ConfirmClientAppointmentComposer() {
    const usecase = new ConfirmAppointmentUseCase_1.ConfirmAppointmentUseCase(new AppointmentsRepo_1.AppointmentsRepository(), new SessionRepo_1.SessionsRepository(), new UserRepo_1.UserRepository(), new ChatSessionRepo_1.ChatSessionRepository());
    return new ConfirmClientAppointmentController_1.ConfirmClientAppointment(usecase);
}
