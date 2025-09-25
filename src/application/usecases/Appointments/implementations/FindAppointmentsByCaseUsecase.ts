import { Appointment } from "@src/application/dtos/Appointments/BaseAppointmentDto";
import { IFindAppointmentsByCaseUsecase } from "../IFindAppointmentsByCaseUsecase";
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";
import { ICaseRepo } from "@domain/IRepository/ICaseRepo";
import { appointmentOutputDto } from "@src/application/dtos/Appointments/FetchAppointmentsDto";

export class FindAppointmentsByCaseUsecase
  implements IFindAppointmentsByCaseUsecase
{
  constructor(
    private _appointmentsRepo: IAppointmentsRepository,
    private _caseRepo: ICaseRepo
  ) {}
  async execute(input: string): Promise<appointmentOutputDto[] | []> {
    const existingCase = await this._caseRepo.findById(input);
    if (!existingCase) throw new Error("Case not found");
    const existingAppointments = await this._appointmentsRepo.findByCaseId(
      existingCase.id
    );
    return existingAppointments;
  }
}
