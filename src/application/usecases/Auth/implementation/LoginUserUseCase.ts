import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { IPasswordManager } from "@src/application/providers/PasswordHasher";
import { IJwtProvider } from "@src/application/providers/JwtProvider";
import { ResposeUserDto } from "@src/application/dtos/user.dto";
import { ILoginUserUseCase } from "../ILoginUserUseCase";

export class LoginUserUseCase implements ILoginUserUseCase {
    constructor(
        private userRepo: IUserRepository,
        private passwordManager: IPasswordManager,
        private tokenManager: IJwtProvider,
    ) {}
    async execute(input: { email: string; password: string }): Promise<{
        user: ResposeUserDto;
        accesstoken: string;
        refreshtoken: string;
    }> {
        let user;
        try {
            user = await this.userRepo.findByEmail(input.email);
        } catch (error) {
            throw new Error("DB_ERROR");
        }
        if (!user || !user.is_verified) throw new Error("USER_NOT_FOUND");

        const isMatch = await this.passwordManager.comparePasswords(input.password, user.password);
        if (!isMatch) throw new Error("INVALID_PASSWORD");

        if (user.is_blocked) throw new Error("USER_BLOCKED");
        const paylod = {
            id: user.user_id,
            email: user.email,
            role: user.role,
            status: user.is_blocked,
        };
        const accesstoken = this.tokenManager.GenerateAccessToken(paylod);

        const refreshtoken = this.tokenManager.GenerateRefreshToken(paylod);

        return { user: new ResposeUserDto(user), accesstoken, refreshtoken };
    }
}
