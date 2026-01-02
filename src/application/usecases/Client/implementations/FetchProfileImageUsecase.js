"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchProfileImageUsecase = void 0;
class FetchProfileImageUsecase {
    _clientRepo;
    _cloudinary;
    constructor(_clientRepo, _cloudinary) {
        this._clientRepo = _clientRepo;
        this._cloudinary = _cloudinary;
    }
    async execute(input) {
        const ClientData = await this._clientRepo.findByUserId(input);
        if (!ClientData)
            throw new Error("user not found");
        if (!ClientData.profile_image) {
            throw new Error("no profile image exists");
        }
        const secUrl = await this._cloudinary.genrateSecureUrl(ClientData.profile_image);
        return secUrl;
    }
}
exports.FetchProfileImageUsecase = FetchProfileImageUsecase;
