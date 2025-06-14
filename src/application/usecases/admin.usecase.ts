import { use } from "passport";
import { Client } from "../../domain/entities/Client.entity";
import { User } from "../../domain/entities/User.entity";
import { IAddressRepository } from "../../domain/I_repository/I_address.repo";
import { IClientRepository } from "../../domain/I_repository/I_client.repo";
import { IUserRepository } from "../../domain/I_repository/I_user.repo";
import { IAdminUseCase } from "./I_usecases/I_adminusecase";
import { lawyer } from "../../domain/entities/Lawyer.entity";
import { ILawyerRepository } from "../../domain/I_repository/I_lawyer.repo";

export class AdminUseCase implements IAdminUseCase {
  constructor(
    private clientRepo: IClientRepository,
    private userRepo: IUserRepository,
    private addressRepo: IAddressRepository,
    private LawyerRepo: ILawyerRepository
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
    const response = await this.userRepo.findLawyersByQuery({...query})
    return response
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
}
