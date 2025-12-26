import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { IPasswordManager } from "@src/application/providers/PasswordHasher";
import { IJwtProvider } from "@src/application/providers/JwtProvider";
import { ResposeUserDto } from "@src/application/dtos/user.dto";
import { ILoginUserUseCase } from "../ILoginUserUseCase";

export class LoginUserUseCase implements ILoginUserUseCase {
    constructor(
        private _userRepo: IUserRepository,
        private _passwordManager: IPasswordManager,
        private _tokenManager: IJwtProvider,
    ) {}
    async execute(input: { email: string; password: string }): Promise<{
        user: ResposeUserDto;
        accesstoken: string;
        refreshtoken: string;
    }> {
        let user;
        try {
            user = await this._userRepo.findByEmail(input.email);
        } catch (error) {
            throw new Error("DB_ERROR");
        }
        if (!user) throw new Error("USER_NOT_FOUND");

        const isMatch = await this._passwordManager.comparePasswords(input.password, user.password);
        if (!isMatch) throw new Error("INVALID_PASSWORD");

        if (user.is_blocked) throw new Error("USER_BLOCKED");
        const paylod = {
            id: user.user_id,
            email: user.email,
            role: user.role,
            status: user.is_blocked,
        };
        const accesstoken = this._tokenManager.GenerateAccessToken(paylod);

        const refreshtoken = this._tokenManager.GenerateRefreshToken(paylod);

        return { user: new ResposeUserDto(user), accesstoken, refreshtoken };
    }
}
