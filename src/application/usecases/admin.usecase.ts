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
  async fetchUsers(query: any): Promise<Client[]> {
    const users = await this.userRepo.findAll(query);
    const addresses = await this.addressRepo.findAll();
    const clients = await this.clientRepo.findAll();
    const clientMap = new Map(
      clients.map((client) => [client.user_id, client])
    );
    const addressMap = new Map(
      addresses.map((address) => [address.user_id, address])
    );

    const responseData = users
      .map((user) => {
        const client = clientMap.get(user.user_id);
        const address = addressMap.get(user.user_id);
        if (!client) return null;
        return {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
          is_verified: user.is_verified,
          is_blocked: user.is_blocked,
          createdAt: user.createdAt,
          profile_image: client.profile_image || null,
          dob: client.dob || null,
          gender: client.gender || null,
          address: address,
        };
      })
      .filter(Boolean);

    return responseData as Client[];
  }
  async fetchLawyers(): Promise<lawyer[] | []> {
    const [users, clients, lawyers] = await Promise.all([
      this.userRepo.findAll({ role: "lawyer" }),
      this.clientRepo.findAll(),
      this.LawyerRepo.findAll(),
    ]);
    
    if(!users || !clients || !lawyers){
      throw new Error("USER_NOT_FOUND");
    }
    console.log("lawyers", lawyers);

    const clientMap = new Map(
      clients.map((client) => [client.user_id, client])
    );
    const lawyerMap = new Map(lawyers.map((lawyer) => [lawyer.user_id, lawyer]));

    const responseData = users.map((user) => {
      const client = clientMap.get(user.user_id);
      const lawyerData= lawyerMap.get(user.user_id);
      // console.log("lawyer:", lawyerData);
      return {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
        is_blocked: user.is_blocked,
        createdAt: user.createdAt,
        profile_image: client?.profile_image || null,
        dob: client?.dob || null,
        gender: client?.gender || null,
        address: client?.address || null,
        mobile: user.mobile || null,
        barcouncil_number: lawyerData?.barcouncil_number || null,
        description: lawyerData?.description || null,
        practice_areas: lawyerData?.practice_areas || [],
        verification_status: lawyerData?.verification_status || "pending",
        experience: lawyerData?.experience || 0,
        specialisation: lawyerData?.specialisation || [],
        consultation_fee: lawyerData?.consultation_fee || 0,
        enrollment_certificate_number:
          lawyerData?.enrollment_certificate_number || null,
        certificate_of_practice_number:
          lawyerData?.certificate_of_practice_number || null,
        documents: lawyerData?.documents || null,
      };
    });

    return responseData as lawyer[] | [];
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
