import { ChatMessage } from "@domain/entities/ChatMessage";
import { IMapper } from "../IMapper";
import { IChatMessageModel } from "@infrastructure/database/model/ChatMessageModel";

export class ChatMessageMapper
implements IMapper<ChatMessage, IChatMessageModel>
{
    toDomain(persistence: IChatMessageModel): ChatMessage {
        return ChatMessage.fromPersistence({
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
    toDomainArray(persistence: IChatMessageModel[]): ChatMessage[] {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity: ChatMessage): Partial<IChatMessageModel> {
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
