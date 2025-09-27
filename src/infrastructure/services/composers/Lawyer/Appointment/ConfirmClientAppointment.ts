import { IController } from "@interfaces/controller/Interface/IController";
import { ConfirmClientAppointment } from "@interfaces/controller/Lawyer/Appointments/ConfirmClientAppointmentController";
import { ConfirmAppointmentUseCase } from "@src/application/usecases/Lawyer/implementations/ConfirmAppointmentUseCase";
import { AppointmentsRepository } from "@infrastructure/database/repo/AppointmentsRepo";
import { SessionsRepository } from "@infrastructure/database/repo/SessionRepo";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { ChatSessionRepository } from "@infrastructure/database/repo/ChatSessionRepo";

export function ConfirmClientAppointmentComposer(): IController {
    const usecase = new ConfirmAppointmentUseCase(
        new AppointmentsRepository(),
        new SessionsRepository(),
        new UserRepository(),
        new ChatSessionRepository(),
    );
    return new ConfirmClientAppointment(usecase);
}
