import { ClientRepository } from "../../infrastructure/database/repo/client.repo";
import { UserRepository } from "../../infrastructure/database/repo/user.repo";
import { ClientDto, ClientUpdateDto } from "../dtos/client.dto";
import { IUserRepository } from "../../domain/repository/user.repo";
import { IClientRepository } from "../../domain/repository/client.repo";
import { ResposeUserDto } from "../dtos/user.dto";
import { sendVerificationEmail } from "../services/email.service";

export class ClientUseCase {
  private userRepository: UserRepository;
  private clientRepository: ClientRepository;
  constructor(clientRepository: IClientRepository, userRepo: IUserRepository) {
    this.clientRepository = clientRepository;
    this.userRepository = userRepo;
  }
  async fetchClientData(user_id: string) {
    try {
      const userDetails = await this.userRepository.findByuser_id(user_id);
      if (!userDetails) {
        throw new Error("USER_NOT_FOUND");
      }
      const clientdetails = await this.clientRepository.findByUserId(user_id);
      if (!clientdetails) {
        throw new Error("CLIENT_NOT_FOUND");
      }
      const responseClientData = new ClientUpdateDto({
        email: userDetails.email || "",
        mobile: userDetails.mobile || "",
        name: userDetails.name || "",
        role: userDetails.role,
        user_id: user_id,
        address: clientdetails.address || "",
        dob: clientdetails.dob || "",
        gender: clientdetails.gender || "",
        profile_image: clientdetails.profile_image || "",
        is_blocked: userDetails.is_blocked,
        is_verified: userDetails.is_verified,
      });
      return responseClientData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async updateClientData(
    clientData: ClientDto & { name: string; mobile: string }
  ) {
    try {
      const userDetails = await this.userRepository.findByuser_id(
        clientData.user_id
      );
      if (!userDetails) {
        throw new Error("USER_NOT_FOUND");
      }
      const clientDetails = await this.clientRepository.findByUserId(
        clientData.user_id
      );

      const updateData = new ClientUpdateDto({
        email: userDetails.email,
        mobile: userDetails.mobile || clientData.mobile || "",
        name: clientData.name || userDetails.name || "",
        role: userDetails.role,
        user_id: userDetails.user_id,
        address: clientData.address || clientDetails?.address || "",
        dob: clientData.dob || clientDetails?.dob || "",
        gender: clientData.gender || clientDetails?.gender || "",
        profile_image:
          clientData.profile_image || clientDetails?.profile_image || "",
      });
      console.log("updated client Data", updateData);
      await this.userRepository.update(updateData);
      await this.clientRepository.update(updateData);
      // while(true){}
      return updateData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async changeEmail(email: string, user_id: string) {
    try {
      const userDetails = await this.userRepository.findByuser_id(user_id);
      if (!userDetails) {
        throw new Error("NO_USER_FOUND");
      }

      await this.userRepository.update({
        email: email || userDetails.email,
        user_id,
        is_blocked: userDetails.is_blocked,
        is_verified: false,
        mobile: userDetails.mobile,
        password: userDetails.password,
        role: userDetails.role,
        name: userDetails.name,
      });
      try {
        await sendVerificationEmail(email, user_id, "");
      } catch (error) {
        throw new Error("MAIL_SEND_ERROR");
      }
      return new ResposeUserDto({
        email: email,
        name: userDetails.name,
        role: userDetails.role,
        user_id: userDetails.user_id,
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async verifyMail(email: string, user_id: string) {
    try {
      await sendVerificationEmail(email, user_id, "");
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
