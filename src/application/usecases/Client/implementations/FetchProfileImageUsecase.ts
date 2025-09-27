import { IClientRepository } from "@domain/IRepository/IClientRepo";
import { IFetchProfileImageUsecase } from "../IFetchProfileImageUsecase";
import { ICloudinaryService } from "@src/application/services/Interfaces/ICloudinaryService";

export class FetchProfileImageUsecase implements IFetchProfileImageUsecase {
    constructor(
    private _clientRepo: IClientRepository,
    private _cloudinary: ICloudinaryService
    ) {}
    async execute(input: string): Promise<string> {
        const ClientData = await this._clientRepo.findByUserId(input);
        if (!ClientData) throw new Error("user not found");
        if (!ClientData.profile_image) {
            throw new Error("no profile image exists");
        }
        const secUrl = await this._cloudinary.genrateSecureUrl(
            ClientData.profile_image
        );
        return secUrl;
    }
}
