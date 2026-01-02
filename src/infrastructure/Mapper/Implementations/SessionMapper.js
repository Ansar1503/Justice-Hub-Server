"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionMapper = void 0;
const Session_1 = require("@domain/entities/Session");
class SessionMapper {
    toDomain(persistence) {
        return Session_1.Session.fromPersistence({
            id: persistence._id,
            appointment_id: persistence.appointment_id,
            client_id: persistence.client_id,
            lawyer_id: persistence.lawyer_id,
            bookingId: persistence.bookingId,
            caseId: persistence.caseId,
            status: persistence.status,
            callDuration: persistence.callDuration,
            client_joined_at: persistence.client_joined_at,
            client_left_at: persistence.client_left_at,
            end_reason: persistence.end_reason,
            end_time: persistence.end_time,
            room_id: persistence.room_id,
            follow_up_session_id: persistence.follow_up_session_id,
            follow_up_suggested: persistence.follow_up_suggested,
            lawyer_joined_at: persistence.lawyer_joined_at,
            lawyer_left_at: persistence.lawyer_left_at,
            notes: persistence.notes,
            start_time: persistence.start_time,
            summary: persistence.summary,
            createdAt: persistence.createdAt,
            updatedAt: persistence.updatedAt,
        });
    }
    toDomainArray(persistence) {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity) {
        return {
            _id: entity.id,
            appointment_id: entity.appointment_id,
            bookingId: entity.bookingId,
            client_id: entity.client_id,
            lawyer_id: entity.lawyer_id,
            caseId: entity.caseId,
            status: entity.status,
            callDuration: entity.callDuration,
            client_joined_at: entity.client_joined_at,
            client_left_at: entity.client_left_at,
            end_reason: entity.end_reason,
            end_time: entity.end_time,
            room_id: entity.room_id,
            follow_up_session_id: entity.follow_up_session_id,
            follow_up_suggested: entity.follow_up_suggested,
            lawyer_joined_at: entity.lawyer_joined_at,
            lawyer_left_at: entity.lawyer_left_at,
            notes: entity.notes,
            start_time: entity.start_time,
            summary: entity.summary,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
exports.SessionMapper = SessionMapper;
