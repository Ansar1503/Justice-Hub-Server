import { ClientUpdateDto } from "@src/application/dtos/client.dto";
import { IUpdateClientDataUseCase } from "../IUpdateClientDataUseCase";
import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { IClientRepository } from "@domain/IRepository/IClientRepo";
import { UpdateBasicInfoInputDto } from "@src/application/dtos/client/UpdateBasicInfoDto";

export class UpdateClientDataUseCase implements IUpdateClientDataUseCase {
  constructor(
    private userRepository: IUserRepository,
    private clientRepository: IClientRepository
  ) {}
  async execute(input: UpdateBasicInfoInputDto): Promise<ClientUpdateDto> {
    try {
      const userDetails = await this.userRepository.findByuser_id(
        input.user_id
      );
      if (!userDetails) {
        throw new Error("USER_NOT_FOUND");
      }
      const clientDetails = await this.clientRepository.findByUserId(
        input.user_id
      );

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
      await this.userRepository.update(updateData);
      await this.clientRepository.update(updateData);
      return updateData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
