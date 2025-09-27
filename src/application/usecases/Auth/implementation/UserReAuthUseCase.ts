import { IJwtProvider } from "@src/application/providers/JwtProvider";
import { IUserReAuth } from "../IUserReAuthUseCase";

export class UserReAuthUseCase implements IUserReAuth {
    constructor(private jwtManager: IJwtProvider) {}

    async execute(input: string): Promise<string> {
        const userpayload = this.jwtManager.VerifyRefreshToken(input);
        const accesstoken = this.jwtManager.GenerateAccessToken(userpayload as any);
        return accesstoken;
    }
}
