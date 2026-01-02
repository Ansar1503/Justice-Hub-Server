"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessageMapper = void 0;
const ChatMessage_1 = require("@domain/entities/ChatMessage");
class ChatMessageMapper {
    toDomain(persistence) {
        return ChatMessage_1.ChatMessage.fromPersistence({
            id: persistence._id,
            senderId: persistence.senderId,
            receiverId: persistence.receiverId,
            session_id: persistence.session_id.toString(),
            read: persistence.read,
            content: persistence.content,
            attachments: persistence.attachments,
            createdAt: persistence.createdAt,
            updatedAt: persistence.updatedAt,
            active: persistence.active,
        });
    }
    toDomainArray(persistence) {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity) {
        return {
            _id: entity.id,
            senderId: entity.senderId,
            receiverId: entity.receiverId,
            session_id: entity.sessionId,
            read: entity.read,
            active: entity.active,
            content: entity.content,
            attachments: entity.attachments,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
exports.ChatMessageMapper = ChatMessageMapper;
