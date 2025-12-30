import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { IResetPasswordUsecase } from "../IResetPasswordusecase";
import { IJwtProvider } from "@src/application/providers/JwtProvider";
import { IPasswordManager } from "@src/application/providers/PasswordHasher";

export class ResetPasswordUsecase implements IResetPasswordUsecase {
  constructor(
    private _userRepo: IUserRepository,
    private _jwtProvider: IJwtProvider,
    private _passwordManager: IPasswordManager
  ) {}
  async execute(input: { token: string; password: string }): Promise<void> {
    const tokenPayload = this._jwtProvider.VerifyEmailToken(input.token);
    if (!tokenPayload) {
      throw new Error("Invalid token");
    }
    const user = await this._userRepo.findByuser_id(tokenPayload.user_id);
    if (!user) {
      throw new Error("User not found");
    }
    const comparePassword = await this._passwordManager.comparePasswords(
      input.password,
      user.password
    );
    if (comparePassword) {
      throw new Error("New password same as old password");
    }
    const hashedPassword = await this._passwordManager.hashPassword(
      input.password
    );
    try {
      user.changePassword(hashedPassword);
      await this._userRepo.update(user);
    } catch (error) {
      throw new Error("Error updating password");
    }
  }
}
