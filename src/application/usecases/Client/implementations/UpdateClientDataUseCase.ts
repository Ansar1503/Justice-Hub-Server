import { ClientUpdateDto } from "@src/application/dtos/client.dto";
import { IUpdateClientDataUseCase } from "../IUpdateClientDataUseCase";
import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { IClientRepository } from "@domain/IRepository/IClientRepo";
import { UpdateBasicInfoInputDto } from "@src/application/dtos/client/UpdateBasicInfoDto";
import { ICloudinaryService } from "@src/application/services/Interfaces/ICloudinaryService";

export class UpdateClientDataUseCase implements IUpdateClientDataUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _clientRepository: IClientRepository,
    private _Cloudinary: ICloudinaryService
  ) {}
  async execute(input: UpdateBasicInfoInputDto): Promise<ClientUpdateDto> {
    try {
      const userDetails = await this._userRepository.findByuser_id(
        input.user_id
      );
      if (!userDetails) {
        throw new Error("USER_NOT_FOUND");
      }
      const clientDetails = await this._clientRepository.findByUserId(
        input.user_id
      );
      let securedUrl;
      if (input.profile_image?.trim()) {
        securedUrl = await this._Cloudinary.genrateSecureUrl(
          input.profile_image
        );
      }

      const updateData = new ClientUpdateDto({
        email: userDetails.email,
        mobile: input?.mobile || userDetails.mobile || "",
        name: input.name || userDetails.name || "",
        role: userDetails.role,
        user_id: userDetails.user_id,
        address: clientDetails?.address || "",
        dob: input.dob || clientDetails?.dob || "",
        gender: input.gender || clientDetails?.gender || "",
        profile_image:
          input.profile_image || clientDetails?.profile_image || "",
        is_blocked: userDetails.is_blocked ?? false,
        is_verified: userDetails.is_verified ?? true,
      });
      await this._userRepository.update(updateData);
      await this._clientRepository.update(updateData);
      return {
        ...updateData,
        profile_image:
          securedUrl ||
          input.profile_image ||
          clientDetails?.profile_image ||
          "",
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
