import { MongoUnitofWork } from "@infrastructure/database/UnitofWork/implementations/UnitofWork";
import { BookAppointmentByWalletController } from "@interfaces/controller/Appointments/BookAppointmentByWallet";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { BookAppointmentByWalletUsecase } from "@src/application/usecases/Appointments/implementations/BookAppointmentsByWalletUsecase";

export function BookAppointmentByWalletComposer(): IController {
    const uscase = new BookAppointmentByWalletUsecase(new MongoUnitofWork());
    return new BookAppointmentByWalletController(uscase, new HttpErrors(), new HttpSuccess());
}
