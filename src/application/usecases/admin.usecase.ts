import { use } from "passport";
import { Client } from "../../domain/entities/Client.entity";
import { User } from "../../domain/entities/User.entity";
import { IAddressRepository } from "../../domain/I_repository/I_address.repo";
import { IClientRepository } from "../../domain/I_repository/I_client.repo";
import { IUserRepository } from "../../domain/I_repository/I_user.repo";
import { IAdminUseCase } from "./I_usecases/I_adminusecase";
import { lawyer } from "../../domain/entities/Lawyer.entity";
import { ILawyerRepository } from "../../domain/I_repository/I_lawyer.repo";
import { IAppointmentsRepository } from "../../domain/I_repository/I_Appointments.repo";
import { ISessionsRepo } from "../../domain/I_repository/I_sessions.repo";
import { Appointment } from "../../domain/entities/Appointment.entity";
import { Session } from "../../domain/entities/Session.entity";
import { Disputes } from "../../domain/entities/Disputes";
import { Review } from "../../domain/entities/Review.entity";
import { IDisputes } from "../../domain/I_repository/IDisputes";
import { IreviewRepo } from "../../domain/I_repository/I_review.repo";
import { ValidationError } from "../../interfaces/middelwares/Error/CustomError";

export class AdminUseCase implements IAdminUseCase {
  constructor(
    private clientRepo: IClientRepository,
    private userRepo: IUserRepository,
    private addressRepo: IAddressRepository,
    private LawyerRepo: ILawyerRepository,
    private AppointmentRepo: IAppointmentsRepository,
    private SessionRepo: ISessionsRepo,
    private DisputesRepo: IDisputes,
    private reviewRepo: IreviewRepo
  ) {}
  async fetchUsers(query: {
    role: "lawyer" | "client";
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
    order?: string;
    status: "all" | "verified" | "blocked";
  }): Promise<{
    data: any[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    const users = await this.userRepo.findAll(query);
    return users;
  }
  async fetchLawyers(query: {
    search?: string;
    status?: "verified" | "rejected" | "pending" | "requested";
    sort: "name" | "experience" | "consultation_fee" | "createdAt";
    sortBy: "asc" | "desc";
    limit: number;
    page: number;
  }): Promise<{
    lawyers: any[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    const response = await this.userRepo.findLawyersByQuery({ ...query });
    return response;
  }

  async blockUser(user_id: string): Promise<User> {
    const userDetails = await this.userRepo.findByuser_id(user_id);

    if (!userDetails) {
      throw new Error("USER_NOT_FOUND");
    }
    const updateData = await this.userRepo.update({
      user_id,
      email: userDetails.email,
      is_blocked: !userDetails.is_blocked,
      is_verified: userDetails.is_verified,
      mobile: userDetails.mobile || "",
      name: userDetails.name,
      password: userDetails.password,
      role: userDetails.role,
    });
    return updateData as User;
  }
  async changeVerificationStatus(payload: {
    user_id: string;
    status: "verified" | "rejected" | "pending" | "requested";
  }): Promise<lawyer> {
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
    const lawyerDetails = await this.LawyerRepo.findUserId(payload.user_id);
    // console.log("lawyerde", lawyerDetails);
    if (!lawyerDetails) {
      throw new Error("NO_VERFICATION_RECORD");
    }
    if (lawyerDetails?.verification_status === "rejected") {
      throw new Error("VERIFICATION_REJECT");
    }
    if (lawyerDetails?.verification_status === "verified") {
      throw new Error("LAWYER_ALREADY_VERIFIED");
    }
    const updatedlawyer = await this.LawyerRepo.update(payload.user_id, {
      description: lawyerDetails.description,
      barcouncil_number: lawyerDetails.barcouncil_number,
      enrollment_certificate_number:
        lawyerDetails.enrollment_certificate_number,
      certificate_of_practice_number:
        lawyerDetails.certificate_of_practice_number,
      practice_areas: lawyerDetails.practice_areas,
      verification_status: payload.status,
      experience: lawyerDetails.experience,
      specialisation: lawyerDetails.specialisation,
      consultation_fee: lawyerDetails.consultation_fee,
      user_id: lawyerDetails.user_id,
      documents: lawyerDetails.documents._id as any,
    });
    if (!updatedlawyer) {
      throw new Error("FAILED_TO_UPDATE_VERIFICATION_STATUS");
    }
    return updatedlawyer;
  }
  async fetchAppointments(payload: {
    search: string;
    limit: number;
    page: number;
    sortBy: "date" | "amount" | "lawyer_name" | "client_name";
    sortOrder: "asc" | "desc";
    status:
      | "pending"
      | "confirmed"
      | "completed"
      | "cancelled"
      | "rejected"
      | "all";
    type: "consultation" | "follow-up" | "all";
  }): Promise<{
    data: (Appointment & { clientData: Client; lawyerData: Client }[]) | [];
    totalCount: number;
    currentPage: number;
    totalPage: number;
  }> {
    return await this.AppointmentRepo.findAllAggregate(payload);
  }
  async fetchSessions(payload: {
    search?: string;
    limit: number;
    page: number;
    sortBy?: "date" | "amount" | "lawyer_name" | "client_name";
    sortOrder?: "asc" | "desc";
    status?:
      | "upcoming"
      | "ongoing"
      | "completed"
      | "cancelled"
      | "missed"
      | "all";
    type?: "consultation" | "follow-up" | "all";
  }): Promise<{
    data: (Session & { clientData: Client; lawyerData: Client }[]) | [];
    totalCount: number;
    currentPage: number;
    totalPage: number;
  }> {
    return await this.SessionRepo.findSessionsAggregate(payload);
  }
  async fetchReviewDisputes(payload: {
    limit: number;
    page: number;
    search: string;
    sortBy: "review_date" | "reported_date" | "All";
    sortOrder: "asc" | "desc";
  }): Promise<{
    data:
      | ({
          contentData: Review;
          reportedByuserData: Client;
          reportedUserData: Client;
        } & Disputes)[]
      | [];
    totalCount: number;
    currentPage: number;
    totalPage: number;
  }> {
    return await this.DisputesRepo.findReviewDisputes(payload);
  }
  async deleteDisputeReview(payload: {
    reviewId: string;
    disputeId: string;
  }): Promise<Disputes | null> {
    const exists = await this.reviewRepo.findByReview_id(payload.reviewId);
    if (!exists) throw new ValidationError("Review not found");
    const existsDisputes = await this.DisputesRepo.findByContentId({
      contentId: payload.reviewId,
    });
    if (!existsDisputes) throw new ValidationError("Dispute not found");
    switch (existsDisputes.status) {
      case "rejected":
        throw new ValidationError("disputes already rejected");
      case "resolved":
        throw new ValidationError("disputes already resolved");
    }
    await this.reviewRepo.delete(payload.reviewId);
    return await this.DisputesRepo.updateReviewDispute({
      disputeId: payload.disputeId,
      status: "resolved",
    });
  }
}
