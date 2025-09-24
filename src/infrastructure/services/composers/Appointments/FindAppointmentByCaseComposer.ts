import { AppointmentsRepository } from "@infrastructure/database/repo/AppointmentsRepo";
import { CaseRepository } from "@infrastructure/database/repo/CaseRepository";
import { CaseMapper } from "@infrastructure/Mapper/Implementations/CaseMapper";
import { FindAppointmentByCaseController } from "@interfaces/controller/Appointments/FindAppointmentsByCaseController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FindAppointmentsByCaseUsecase } from "@src/application/usecases/Appointments/implementations/FindAppointmentsByCaseUsecase";

export function FindAppointmentByCaseComposer(): IController {
  const usecase = new FindAppointmentsByCaseUsecase(
    new AppointmentsRepository(),
    new CaseRepository(new CaseMapper())
  );
  return new FindAppointmentByCaseController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
