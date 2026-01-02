"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSessionMapper = void 0;
const ChatSession_1 = require("@domain/entities/ChatSession");
class ChatSessionMapper {
    toDomain(persistence) {
        return ChatSession_1.ChatSession.fromPersistence({
            id: persistence._id,
            session_id: persistence.session_id,
            last_message: persistence.last_message,
            name: persistence.name,
            participants: persistence.participants,
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
            session_id: entity.sessionId,
            last_message: entity.lastMessage,
            name: entity.name,
            participants: entity.participants,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
exports.ChatSessionMapper = ChatSessionMapper;
