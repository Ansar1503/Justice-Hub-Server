import { ILawyerDocumentsRepository } from "@domain/IRepository/ILawyerDocumentsRepo";
import { LawyerDocuments } from "@domain/entities/LawyerDocument";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import { lawyerDocumentsMapper } from "@infrastructure/Mapper/Implementations/LawyerDocumentMapper";
import { ClientSession } from "mongoose";
import LawyerDocumentsModel, { ILawyerDocumentsModel } from "../model/LawyerDocumentsModel";

export class LawyerDocumentsRepository implements ILawyerDocumentsRepository {
    constructor(
        private _mapper: IMapper<LawyerDocuments, ILawyerDocumentsModel> = new lawyerDocumentsMapper(),
        private _session?: ClientSession,
    ) {}
    async create(documents: LawyerDocuments): Promise<LawyerDocuments> {
        const createdDocument = await LawyerDocumentsModel.findOneAndUpdate(
            { _id: documents.id, userId: documents.userId },
            {
                barCouncilCertificate: documents.barCouncilCertificate,
                enrollmentCertificate: documents.enrollmentCertificate,
                certificateOfPractice: documents.certificateOfPractice,
            },
            { upsert: true, new: true, session: this._session },
        );

        return this._mapper.toDomain(createdDocument);
    }

    async find(user_id: string): Promise<LawyerDocuments | null> {
        const data = await LawyerDocumentsModel.findOne({ userId: user_id }, {}, { session: this._session });
        return data ? this._mapper.toDomain(data) : null;
    }
}
