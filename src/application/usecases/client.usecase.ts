import { ClientRepository } from "../../infrastructure/database/repo/client.repo";
import { UserRepository } from "../../infrastructure/database/repo/user.repo";
import { ClientDto, ClientUpdateDto } from "../dtos/client.dto";
import { IUserRepository } from "../../domain/I_repository/I_user.repo";
import { IClientRepository } from "../../domain/I_repository/I_client.repo";
import { ResposeUserDto } from "../dtos/user.dto";
import { sendVerificationEmail } from "../services/email.service";
import bcrypt from "bcrypt";
import { Address } from "../../domain/entities/Address.entity";
import { AddressRepository } from "../../infrastructure/database/repo/address.repo";
import { IAddressRepository } from "../../domain/I_repository/I_address.repo";

export class ClientUseCase {
  private userRepository: UserRepository;
  private clientRepository: ClientRepository;
  private addressRepository: AddressRepository;
  constructor(
    clientRepository: IClientRepository,
    userRepo: IUserRepository,
    addressRepo: IAddressRepository
  ) {
    this.clientRepository = clientRepository;
    this.userRepository = userRepo;
    this.addressRepository = addressRepo;
  }
  async fetchClientData(user_id: string) {
    try {
      const userDetails = await this.userRepository.findByuser_id(user_id);
      if (!userDetails) {
        throw new Error("USER_NOT_FOUND");
      }
      const clientdetails = await this.clientRepository.findByUserId(user_id);
      const addressDetails = await this.addressRepository.find(user_id);

      if (!clientdetails) {
        throw new Error("CLIENT_NOT_FOUND");
      }
      const address = {
        city: addressDetails?.city || "",
        locality: addressDetails?.locality || "",
        state: addressDetails?.state || "",
        pincode: addressDetails?.pincode || "",
      };
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
      return {
        ...responseClientData,
        address,
      };
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
        mobile: clientData?.mobile || userDetails.mobile || "",
        name: clientData.name || userDetails.name || "",
        role: userDetails.role,
        user_id: userDetails.user_id,
        address: clientData.address || clientDetails?.address || "",
        dob: clientData.dob || clientDetails?.dob || "",
        gender: clientData.gender || clientDetails?.gender || "",
        profile_image:
          clientData.profile_image || clientDetails?.profile_image || "",
      });
      // console.log("updated client Data", updateData);
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

  async updatePassword(payload: {
    currentPassword: string;
    user_id: string;
    password: string;
  }) {
    const userDetails = await this.userRepository.findByuser_id(
      payload.user_id
    );
    const clientDetails = await this.clientRepository.findByUserId(
      payload.user_id
    );

    if (!userDetails) {
      throw new Error("USER_NOT_FOUND");
    }
    if (userDetails.is_blocked) {
      throw new Error("USER_BLOCKED");
    }

    const currpassmatch = await bcrypt.compare(
      payload.currentPassword,
      userDetails.password
    );

    if (!currpassmatch) {
      throw new Error("PASS_NOT_MATCH");
    }

    const passmatch = await bcrypt.compare(
      payload.password,
      userDetails.password
    );

    if (passmatch) {
      throw new Error("PASS_EXIST");
    }

    const newpass = await bcrypt.hash(payload.password, 10);

    const updateData = new ClientUpdateDto({
      email: userDetails.email,
      mobile: userDetails.mobile || "",
      name: userDetails.name,
      role: userDetails.role,
      user_id: payload.user_id,
      password: newpass,
      address: clientDetails?.address,
      dob: clientDetails?.dob,
      gender: clientDetails?.gender,
      is_blocked: userDetails.is_blocked,
      is_verified: userDetails.is_verified,
      profile_image: clientDetails?.profile_image,
    });

    await this.userRepository.update(updateData);
    return updateData;
  }

  async updateAddress(payload: Address & { user_id: string }) {
    const userDetails = await this.userRepository.findByuser_id(
      payload.user_id
    );
    const clientDetails = await this.clientRepository.findByUserId(
      payload.user_id
    );
    if (!userDetails) {
      throw new Error("USER_NOT_FOUND");
    }

    if (userDetails.is_blocked) {
      throw new Error("USER_BLOCKED");
    }

    const updatedAddress = await this.addressRepository.update(payload);
    const updateData = new ClientUpdateDto({
      email: userDetails.email,
      mobile: userDetails.mobile || "",
      name: userDetails.name,
      role: userDetails.role,
      user_id: payload.user_id,
      address: updatedAddress._id,
      profile_image: clientDetails?.profile_image || "",
      dob: clientDetails?.dob || "",
      gender: clientDetails?.gender || "",
    });
    await this.clientRepository.update(updateData);
  }
}
