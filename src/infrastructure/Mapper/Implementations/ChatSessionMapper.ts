import { ChatSession } from "@domain/entities/ChatSession";
import { IMapper } from "../IMapper";
import { IChatSessionModel } from "@infrastructure/database/model/ChatSessionModel";

export class ChatSessionMapper
implements IMapper<ChatSession, IChatSessionModel>
{
    toDomain(persistence: IChatSessionModel): ChatSession {
        return ChatSession.fromPersistence({
            id: persistence._id,
            session_id: persistence.session_id,
            last_message: persistence.last_message,
            name: persistence.name,
            participants: persistence.participants,
            createdAt: persistence.createdAt,
            updatedAt: persistence.updatedAt,
        });
    }
    toDomainArray(persistence: IChatSessionModel[]): ChatSession[] {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity: ChatSession): Partial<IChatSessionModel> {
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
