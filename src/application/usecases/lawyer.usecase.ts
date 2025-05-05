import { lawyer } from "../../domain/entities/Lawyer.entity";
import { BlockedSchedule } from "../../domain/entities/Schedule.entity";
import { IClientRepository } from "../../domain/I_repository/I_client.repo";
import { IDocumentsRepository } from "../../domain/I_repository/I_documents.repo";
import { ILawyerRepository } from "../../domain/I_repository/I_lawyer.repo";
import { IScheduleRepo } from "../../domain/I_repository/I_schedule.repo";
import { IUserRepository } from "../../domain/I_repository/I_user.repo";
import { Ilawyerusecase } from "./I_usecases/I_lawyer.usecase";

export class LawyerUsecase implements Ilawyerusecase {
  constructor(
    private userRepo: IUserRepository,
    private clientRepo: IClientRepository,
    private lawyerRepo: ILawyerRepository,
    private scheduleRepo: IScheduleRepo,
    private documentsRepo: IDocumentsRepository
  ) {}
  async verifyLawyer(payload: lawyer): Promise<lawyer> {
    const userDetails = await this.userRepo.findByuser_id(payload.user_id);
    if (!userDetails) {
      throw new Error("USER_NOT_FOUND");
    }
    if (userDetails.role !== "lawyer") {
      throw new Error("USER_NOT_LAWYER");
    }
    if (userDetails.is_blocked) {
      throw new Error("USER_BLOCKED");
    }
    const document = await this.documentsRepo.find({
      user_id: userDetails.user_id,
      email: userDetails.email,
    });
    const lawyerVerficationData = await this.lawyerRepo.findUserId(
      userDetails.user_id
    );
    if (lawyerVerficationData && document) {
      throw new Error("VERIFICATION_EXISTS");
    }
    const documents = await this.documentsRepo.create(payload.documents);
    if (!documents) {
      throw new Error("DOCUMENT_NOT_FOUND");
    }
    // console.log("document created", documents);

    const lawyerData = await this.lawyerRepo.update(userDetails.user_id, {
      user_id: userDetails.user_id,
      description: payload.description || "",
      barcouncil_number: payload.barcouncil_number,
      enrollment_certificate_number: payload.enrollment_certificate_number,
      certificate_of_practice_number: payload.certificate_of_practice_number,
      practice_areas: payload.practice_areas,
      specialisation: payload.specialisation,
      verification_status: "requested",
      experience: payload.experience,
      consultation_fee: payload.consultation_fee,
      documents: documents._id as any,
    } as lawyer);
    return lawyerData as lawyer;
  }

  async fetchLawyerData(user_id: string): Promise<lawyer | null> {
    const userDetails = await this.userRepo.findByuser_id(user_id);

    if (!userDetails) {
      throw new Error("USER_NOT_FOUND");
    }
    if (userDetails.role !== "lawyer") {
      throw new Error("UNAUTHORIZED");
    }
    if (userDetails.is_blocked) {
      throw new Error("USER_BLOCKED");
    }
    const lawyerDetails = await this.lawyerRepo.findUserId(user_id);
    if (!lawyerDetails) {
      throw new Error("USER_NOT_FOUND");
    }

    return {
      ...userDetails,
      ...lawyerDetails,
    };
  }
  async addBlockedSchedule(payload: BlockedSchedule): Promise<void> {
    const user = await this.userRepo.findByuser_id(payload.lawyer_id);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }
    if (user.is_blocked) {
      throw new Error("USER_BLOCKED");
    }
    const lawyer = await this.lawyerRepo.findUserId(payload.lawyer_id);
    if (!lawyer) {
      throw new Error("LAWYER_NOT_FOUND");
    }
    if (lawyer.verification_status !== "verified") {
      throw new Error("LAWYER_UNVERIFIED");
    }
    const existingBlock = await this.scheduleRepo.findBlockedSchedule(
      payload.date
    );

    if (existingBlock) {
      throw new Error("BLOCK_EXIST");
    }

    await this.scheduleRepo.createBlockedSchedule(payload);
  }
  async fetchAllBlockedSchedule(
    lawyer_id: string
  ): Promise<BlockedSchedule[] | []> {
    const user = await this.userRepo.findByuser_id(lawyer_id);
    if (!user) throw new Error("LAWYERNOTFOUND");
    if (user.is_blocked) throw new Error("LAWYERBLOCKED");
    const lawyer = await this.lawyerRepo.findUserId(lawyer_id);
    if (!lawyer) throw new Error("LAWYERNOTFOUND");
    if (lawyer.verification_status !== "verified")
      throw new Error("LAWYERUNVERIFIED");
    return await this.scheduleRepo.findAllBlockedSchedule(lawyer_id);
  }
  async removeBlockedSchedule(id: string): Promise<void> {
    await this.scheduleRepo.deleteBlockedSchedule(id);
  }
}
