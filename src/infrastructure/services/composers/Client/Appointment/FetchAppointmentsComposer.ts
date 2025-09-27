import { IController } from "@interfaces/controller/Interface/IController";
import { FetchAppointmentDataController } from "@interfaces/controller/Client/Appointment/FetchAppointmentDataController";
import { FetchAppointmentsClientUseCase } from "@src/application/usecases/Client/implementations/FetchAppointmentsClientUsecase";
import { AppointmentsRepository } from "@infrastructure/database/repo/AppointmentsRepo";

export function FetchAppointmentDataComposer(): IController {
    const useCase = new FetchAppointmentsClientUseCase(
        new AppointmentsRepository()
    );
    return new FetchAppointmentDataController(useCase);
}
