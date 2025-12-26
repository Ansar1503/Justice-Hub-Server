import { IJwtProvider } from "@src/application/providers/JwtProvider";
import { IUserReAuth } from "../IUserReAuthUseCase";

export class UserReAuthUseCase implements IUserReAuth {
    constructor(private _jwtManager: IJwtProvider) {}

    async execute(input: string): Promise<string> {
        const userpayload = this._jwtManager.VerifyRefreshToken(input);
        const accesstoken = this._jwtManager.GenerateAccessToken(userpayload as any);
        return accesstoken;
    }
}
