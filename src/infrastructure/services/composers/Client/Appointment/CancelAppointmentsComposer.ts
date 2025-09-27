import { AppointmentsRepository } from "@infrastructure/database/repo/AppointmentsRepo";
import { WalletRepo } from "@infrastructure/database/repo/WalletRepo";
import { WalletTransactionsRepo } from "@infrastructure/database/repo/WalletTransactionsRepo";
import { MongoUnitofWork } from "@infrastructure/database/UnitofWork/implementations/UnitofWork";
import { CancelAppointmentController } from "@interfaces/controller/Client/Appointment/CancelAppoitmentController";
import { IController } from "@interfaces/controller/Interface/IController";
import { CancelAppointmentUseCase } from "@src/application/usecases/Client/implementations/CancelAppointmentUseCase";

export function CancelAppointmentComposer(): IController {
    const useCase = new CancelAppointmentUseCase(new AppointmentsRepository(), new MongoUnitofWork());
    return new CancelAppointmentController(useCase);
}
