import { Appointment } from "@src/application/dtos/Appointments/BaseAppointmentDto";
import { IFindAppointmentsByCaseUsecase } from "../IFindAppointmentsByCaseUsecase";
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";
import { ICaseRepo } from "@domain/IRepository/ICaseRepo";

export class FindAppointmentsByCaseUsecase
  implements IFindAppointmentsByCaseUsecase
{
  constructor(
    private _appointmentsRepo: IAppointmentsRepository,
    private _caseRepo: ICaseRepo
  ) {}
  async execute(input: string): Promise<Appointment[] | []> {
    const existingCase = await this._caseRepo.findById(input);
    if (!existingCase) throw new Error("Case not found");
    const existingAppointments = await this._appointmentsRepo.findByCaseId(
      existingCase.id
    );
    return existingAppointments
      ? existingAppointments.map((a) => ({
          amount: a.amount,
          caseId: a.caseId,
          bookingId:a.booingId,
          client_id: a.client_id,
          createdAt: a.createdAt,
          id: a.id,
          updatedAt: a.updatedAt,
          date: a.date,
          time: a.time,
          duration: a.duration,
          lawyer_id: a.lawyer_id,
          payment_status: a.payment_status,
          reason: a.reason,
          status: a.status,
          type: a.type,
        }))
      : [];
  }
}
