import { MongoUnitofWork } from "@infrastructure/database/UnitofWork/implementations/UnitofWork";
import { BookFollowupAppointmentByWalletController } from "@interfaces/controller/Appointments/BookFollowupAppointmentByWallet";
import { IController } from "@interfaces/controller/Interface/IController";
import { BookFollowupAppointmentByWalletUsecase } from "@src/application/usecases/Appointments/implementations/BookFollowupAppointmentByWalletUsecase";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { CommissionSettingsRepo } from "@infrastructure/database/repo/CommissionSettingsRepo";
import { CommissionSettingsMapper } from "@infrastructure/Mapper/Implementations/CommissionSettingsMapper";

export function BookFollowupAppointmentByWalletComposer(): IController {
  const usecase = new BookFollowupAppointmentByWalletUsecase(
    new MongoUnitofWork(),
    new CommissionSettingsRepo(new CommissionSettingsMapper())
  );
  return new BookFollowupAppointmentByWalletController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
