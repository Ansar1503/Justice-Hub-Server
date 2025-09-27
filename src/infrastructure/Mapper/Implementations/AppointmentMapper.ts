import { Appointment } from "@domain/entities/Appointment";
import { IAppointmentModel } from "@infrastructure/database/model/AppointmentsModel";
import { IMapper } from "../IMapper";

export class AppointmentMapper implements IMapper<Appointment, IAppointmentModel> {
    toDomain(persistence: IAppointmentModel): Appointment {
        return Appointment.fromPersistence({
            amount: persistence.amount,
            client_id: persistence.client_id,
            caseId: persistence.caseId,
            bookingId: persistence.bookingId,
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
    toPersistence(entity: Appointment): Partial<IAppointmentModel> {
        return {
            _id: entity.id,
            client_id: entity.client_id,
            lawyer_id: entity.lawyer_id,
            caseId: entity.caseId,
            bookingId: entity.bookingId,
            date: entity.date,
            time: entity.time,
            duration: entity.duration,
            reason: entity.reason,
            amount: entity.amount,
            type: entity.type,
            payment_status: entity.payment_status,
            status: entity.status,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
    toDomainArray(persistence: IAppointmentModel[]): Appointment[] {
        return persistence.map((per) => this.toDomain(per));
    }
}
