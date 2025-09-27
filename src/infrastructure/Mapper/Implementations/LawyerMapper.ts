import { Lawyer } from "@domain/entities/Lawyer";
import { IMapper } from "../IMapper";
import { ILawyerModel } from "@infrastructure/database/model/LawyerModel";

export class LawyerMapper implements IMapper<Lawyer, ILawyerModel> {
    toDomain(persistence: ILawyerModel): Lawyer {
        return Lawyer.fromPersistence({
            createdAt: persistence.createdAt,
            description: persistence.description,
            experience: persistence.experience,
            id: persistence._id,
            updatedAt: persistence.updatedAt,
            consultationFee: persistence.consultationFee,
            practiceAreas: persistence.practiceAreas,
            specializations: persistence.specialisations,
            userId: persistence.userId,
        });
    }

    toPersistence(entity: Lawyer): Partial<ILawyerModel> {
        return {
            _id: entity.id,
            userId: entity.userId,
            description: entity.description,
            experience: entity.experience,
            consultationFee: entity.consultationFee,
            practiceAreas: entity.practiceAreas,
            specialisations: entity.specializations,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    toDomainArray(persistence: ILawyerModel[]): Lawyer[] {
        return persistence.map((p) => this.toDomain(p));
    }
}
