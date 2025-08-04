import { Appointment } from "@domain/entities/Appointment.entity";
import { IMapper } from "../IMapper";
import { IAppointmentModel } from "@infrastructure/database/model/appointments.model";

export class AppointmentMapper
  implements IMapper<Appointment, IAppointmentModel>
{
  toDomain(persistence: IAppointmentModel): Appointment {
    return Appointment.fromPersistence({
      amount: persistence.amount,
      client_id: persistence.client_id,
      createdAt: persistence.createdAt,
      date: persistence.date,
      duration: persistence.duration,
      id: persistence._id.toString(),
      lawyer_id: persistence.lawyer_id,
      payment_status: persistence.payment_status,
      reason: persistence.reason,
      status: persistence.status,
      time: persistence.time,
      type: persistence.type,
      updatedAt: persistence.updatedAt,
    });
  }
  toPersistence(entity: Appointment): Partial<IAppointmentModel> {}
}
