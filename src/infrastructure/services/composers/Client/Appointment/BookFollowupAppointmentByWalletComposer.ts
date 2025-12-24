import { MongoUnitofWork } from "@infrastructure/database/UnitofWork/implementations/UnitofWork";
import { BookFollowupAppointmentByWalletController } from "@interfaces/controller/Appointments/BookFollowupAppointmentByWallet";
import { IController } from "@interfaces/controller/Interface/IController";
import { BookFollowupAppointmentByWalletUsecase } from "@src/application/usecases/Appointments/implementations/BookFollowupAppointmentByWalletUsecase";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";

export function BookFollowupAppointmentByWalletComposer(): IController {
  const usecase = new BookFollowupAppointmentByWalletUsecase(
    new MongoUnitofWork()
  );
  return new BookFollowupAppointmentByWalletController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
