"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentMapper = void 0;
const Appointment_1 = require("@domain/entities/Appointment");
class AppointmentMapper {
    toDomain(persistence) {
        return Appointment_1.Appointment.fromPersistence({
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
    toPersistence(entity) {
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
    toDomainArray(persistence) {
        return persistence.map((per) => this.toDomain(per));
    }
}
exports.AppointmentMapper = AppointmentMapper;
