import { AppointmentsRepository } from "@infrastructure/database/repo/AppointmentsRepo";
import { AvailableSlotRepository } from "@infrastructure/database/repo/AvailableSlotsRepo";
import { CaseRepository } from "@infrastructure/database/repo/CaseRepository";
import { LawyerRepository } from "@infrastructure/database/repo/LawyerRepo";
import { LawyerVerificationRepo } from "@infrastructure/database/repo/LawyerVerificationRepo";
import { OverrideSlotsRepository } from "@infrastructure/database/repo/OverrideSlotsRepo";
import { ScheduleSettingsRepository } from "@infrastructure/database/repo/ScheduleSettingsRepo";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { WalletRepo } from "@infrastructure/database/repo/WalletRepo";
import { MongoUnitofWork } from "@infrastructure/database/UnitofWork/implementations/UnitofWork";
import { CaseMapper } from "@infrastructure/Mapper/Implementations/CaseMapper";
import { LawyerVerificationMapper } from "@infrastructure/Mapper/Implementations/LawyerVerificaitionMapper";
import { BookAppointmentByWalletController } from "@interfaces/controller/Appointments/BookAppointmentByWallet";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { BookAppointmentByWalletUsecase } from "@src/application/usecases/Appointments/implementations/BookAppointmentsByWalletUsecase";

export function BookAppointmentByWalletComposer(): IController {
    const uscase = new BookAppointmentByWalletUsecase(new MongoUnitofWork());
    return new BookAppointmentByWalletController(
        uscase,
        new HttpErrors(),
        new HttpSuccess()
    );
}
