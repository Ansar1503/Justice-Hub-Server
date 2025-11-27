import { GoogleAuthInputDto, GoogleAuthOutputDto } from "@src/application/dtos/client/GoogleAuthDto";
import { IGoogleAuthUsecase } from "../IgoogleAuthUsecase";
import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { IGoogleAuthProvider } from "@src/application/providers/IGoogleAuthProvider";
import { User } from "@domain/entities/User";
import { IJwtProvider } from "@src/application/providers/JwtProvider";
import { IUnitofWork } from "@infrastructure/database/UnitofWork/IUnitofWork";
import { Client } from "@domain/entities/Client";

export class GoogleAuthUsecase implements IGoogleAuthUsecase {
    constructor(private _googleProvider: IGoogleAuthProvider, private _jwtProvider: IJwtProvider, private _uow: IUnitofWork) { }
    async execute(input: GoogleAuthInputDto): Promise<GoogleAuthOutputDto> {
        const googleUser = await this._googleProvider.verifyToken(input.credential);
        if (!googleUser.email)
            throw new Error("Google email not found");
        const email = googleUser.email;
        const name = googleUser.name || email.split("@")[0];
        return this._uow.startTransaction(async (uow) => {
            let user = await uow.userRepo.findByEmail(email);
            if (!user) {
                user = User.create({
                    name,
                    email,
                    mobile: "",
                    password: "google",
                    role: "client",
                });

                user.verify();
                try {
                    await uow.userRepo.create(user);
                } catch (error) {
                    throw new Error("Database Error creating user")
                }
                try {
                    const client = Client.create({
                        address: "",
                        dob: "",
                        gender: "",
                        profile_image: "",
                        user_id: user.user_id
                    })
                    await uow.clientRepo.create(client)
                } catch (error) {
                    throw new Error("Database Error creating client")
                }
            }
            if (user.is_blocked) {
                throw new Error("User is blocked")
            }
            const client = await uow.clientRepo.findByUserId(user.user_id)
            if (!client) {
                try {
                    const client = Client.create({
                        address: "",
                        dob: "",
                        gender: "",
                        profile_image: "",
                        user_id: user.user_id
                    })
                    await uow.clientRepo.create(client)
                } catch (error) {
                    throw new Error("Database Error creating client")
                }
            }
            const accesstoken = await this._jwtProvider.GenerateAccessToken({
                email: user.email,
                id: user.user_id,
                role: user.role,
                status: user.is_verified,
            })
            const refreshToken = await this._jwtProvider.GenerateRefreshToken({
                email: user.email,
                id: user.user_id,
                role: user.role,
                status: user.is_verified
            })
            return {
                accesstoken,
                refreshToken,
                user: {
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    user_id: user.user_id,
                }
            }
        })

    }
}