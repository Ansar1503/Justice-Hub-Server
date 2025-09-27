import { ClientUpdateDto } from "@src/application/dtos/client.dto";
import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { IClientRepository } from "@domain/IRepository/IClientRepo";
import { IPasswordManager } from "@src/application/providers/PasswordHasher";
import { IUpdatePasswordUseCase } from "../IUpdatePasswordUseCase";

export class UpdatePasswordUseCase implements IUpdatePasswordUseCase {
    constructor(
        private userRepository: IUserRepository,
        private clientRepository: IClientRepository,
        private passwordManager: IPasswordManager,
    ) {}
    async execute(input: { currentPassword: string; user_id: string; password: string }): Promise<ClientUpdateDto> {
        const userDetails = await this.userRepository.findByuser_id(input.user_id);
        const clientDetails = await this.clientRepository.findByUserId(input.user_id);

        if (!userDetails) {
            throw new Error("USER_NOT_FOUND");
        }
        if (userDetails.is_blocked) {
            throw new Error("USER_BLOCKED");
        }

        const currpassmatch = await this.passwordManager.comparePasswords(input.currentPassword, userDetails.password);

        if (!currpassmatch) {
            throw new Error("PASS_NOT_MATCH");
        }

        const passmatch = await this.passwordManager.comparePasswords(input.password, userDetails.password);

        if (passmatch) {
            throw new Error("PASS_EXIST");
        }

        const newpass = await this.passwordManager.hashPassword(input.password);

        const updateData = new ClientUpdateDto({
            email: userDetails.email,
            mobile: userDetails.mobile || "",
            name: userDetails.name,
            role: userDetails.role,
            user_id: userDetails.user_id,
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
}
