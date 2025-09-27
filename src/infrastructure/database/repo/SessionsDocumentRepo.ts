import { SessionDocument } from "@domain/entities/SessionDocument";
import { ISessionDocumentRepo } from "@domain/IRepository/ISessionDocumentsRepo";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import SessionDocumentsModel, {
    ISessionDocumentModel,
} from "../model/SessionDocumentsModel";
import { SessionDocumentMapper } from "@infrastructure/Mapper/Implementations/SessionDocumentMapper";

export class SessionDocumentsRepository implements ISessionDocumentRepo {
    constructor(
    private mapper: IMapper<
      SessionDocument,
      ISessionDocumentModel
    > = new SessionDocumentMapper()
    ) {}
    async create(payload: SessionDocument): Promise<SessionDocument> {
        const newpayload = this.mapper.toPersistence(payload);
        const newSession = new SessionDocumentsModel(newpayload);
        await newSession.save();
        return this.mapper.toDomain(newSession);
    }

    async findBySessionId(payload: {
    session_id: string;
  }): Promise<SessionDocument | null> {
        const document = await SessionDocumentsModel.findOne({
            session_id: payload.session_id,
        });
        if (!document) return null;
        return this.mapper.toDomain(document);
    }

    async removeOne(documentId: string): Promise<SessionDocument | null> {
        const data = await SessionDocumentsModel.findOneAndUpdate(
            {
                "document._id": documentId,
            },
            {
                $pull: {
                    document: {
                        _id: documentId,
                    },
                },
            },
            { new: true }
        );
        return data ? this.mapper.toDomain(data) : null;
    }
    async removeAll(id: string): Promise<void> {
        await SessionDocumentsModel.findOneAndDelete({ _id: id });
    }
}
