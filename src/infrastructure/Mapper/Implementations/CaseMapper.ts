import { Case } from "@domain/entities/Case";
import { IMapper } from "../IMapper";
import { ICaseModel } from "@infrastructure/database/model/CaseModel";

export class CaseMapper implements IMapper<Case, ICaseModel> {
    toDomain(persistence: ICaseModel): Case {
        return Case.fromPersistance({
            caseType: persistence.caseType,
            clientId: persistence.clientId,
            createdAt: persistence.createdAt,
            id: persistence._id,
            lawyerId: persistence.lawyerId,
            status: persistence.status,
            title: persistence.title,
            updatedAt: persistence.updatedAt,
            summary: persistence.summary,
        });
    }
    toDomainArray(persistence: ICaseModel[]): Case[] {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity: Case): Partial<ICaseModel> {
        return {
            _id: entity.id,
            caseType: entity.caseType,
            clientId: entity.clientId,
            createdAt: entity.createdAt,
            lawyerId: entity.lawyerId,
            status: entity.status,
            title: entity.title,
            updatedAt: entity.updatedAt,
            summary: entity.summary,
        };
    }
}
