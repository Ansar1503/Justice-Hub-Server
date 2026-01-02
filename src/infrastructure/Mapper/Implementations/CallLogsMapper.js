"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallLogsMapper = void 0;
const CallLogs_1 = require("@domain/entities/CallLogs");
class CallLogsMapper {
    toDomain(persistence) {
        return CallLogs_1.CallLogs.fromPersistence({
            id: persistence._id,
            session_id: persistence.session_id.toString(),
            roomId: persistence.roomId,
            start_time: persistence.start_time,
            status: persistence.status,
            callDuration: persistence.callDuration,
            client_joined_at: persistence.client_joined_at,
            client_left_at: persistence.client_left_at,
            lawyer_joined_at: persistence.lawyer_joined_at,
            end_time: persistence.end_time,
            lawyer_left_at: persistence.lawyer_left_at,
            createdAt: persistence.createdAt,
            updatedAt: persistence.updatedAt,
        });
    }
    toPersistence(entity) {
        return {
            _id: entity.id,
            session_id: entity.session_id,
            roomId: entity.roomId,
            start_time: entity.start_time,
            status: entity.status,
            callDuration: entity.callDuration,
            client_joined_at: entity.client_joined_at,
            client_left_at: entity.client_left_at,
            lawyer_joined_at: entity.lawyer_joined_at,
            end_time: entity.end_time,
            lawyer_left_at: entity.lawyer_left_at,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
    toDomainArray(persistence) {
        return persistence.map((p) => this.toDomain(p));
    }
}
exports.CallLogsMapper = CallLogsMapper;
