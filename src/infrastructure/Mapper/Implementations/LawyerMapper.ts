import { Lawyer } from "@domain/entities/Lawyer";
import { IMapper } from "../IMapper";
import { ILawyerModel } from "@infrastructure/database/model/lawyer.model";

export class LawyerMapper implements IMapper<Lawyer, ILawyerModel> {
  toDomain(persistence: ILawyerModel): Lawyer {
    return Lawyer.fromPersistence({
      barcouncil_number: persistence.barcouncil_number,
      certificate_of_practice_number: persistence.barcouncil_number,
      consultation_fee: persistence.consultation_fee,
      createdAt: persistence.createdAt,
      description: persistence.description,
      documents: persistence.documents?.toString(),
      enrollment_certificate_number: persistence.enrollment_certificate_number,
      experience: persistence.experience,
      id: persistence._id,
      practice_areas: persistence.practice_areas,
      rejectReason: persistence.rejectReason,
      specialisation: persistence.specialisation,
      updatedAt: persistence.updatedAt,
      user_id: persistence.user_id,
      verification_status: persistence.verification_status,
    }); 
  }
  toPersistence(entity: Lawyer): Partial<ILawyerModel> {
    return {
      _id: entity.id,
      user_id: entity.user_id,
      description: entity.description,
      barcouncil_number: entity.barcouncil_number,
      enrollment_certificate_number: entity.enrollment_certificate_number,
      certificate_of_practice_number: entity.certificate_of_practice_number,
      verification_status: entity.verification_status,
      practice_areas: entity.practice_areas,
      experience: entity.experience,
      specialisation: entity.specialisation,
      consultation_fee: entity.consultation_fee,
      //   documents: entity.documents,
      rejectReason: entity.rejectReason,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
  toDomainArray(persistence: ILawyerModel[]): Lawyer[] {
    return persistence.map((p) =>
      Lawyer.fromPersistence({
        barcouncil_number: p.barcouncil_number,
        certificate_of_practice_number: p.barcouncil_number,
        consultation_fee: p.consultation_fee,
        createdAt: p.createdAt,
        description: p.description,
        documents: p.documents.toString(),
        enrollment_certificate_number: p.enrollment_certificate_number,
        experience: p.experience,
        id: p._id,
        practice_areas: p.practice_areas,
        rejectReason: p.rejectReason,
        specialisation: p.specialisation,
        updatedAt: p.updatedAt,
        user_id: p.user_id,
        verification_status: p.verification_status,
      })
    );
  }
}
