"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateClientDataUseCase = void 0;
const client_dto_1 = require("@src/application/dtos/client.dto");
class UpdateClientDataUseCase {
    _userRepository;
    _clientRepository;
    _Cloudinary;
    constructor(_userRepository, _clientRepository, _Cloudinary) {
        this._userRepository = _userRepository;
        this._clientRepository = _clientRepository;
        this._Cloudinary = _Cloudinary;
    }
    async execute(input) {
        try {
            const userDetails = await this._userRepository.findByuser_id(input.user_id);
            if (!userDetails) {
                throw new Error("USER_NOT_FOUND");
            }
            const clientDetails = await this._clientRepository.findByUserId(input.user_id);
            let securedUrl;
            if (input.profile_image?.trim()) {
                securedUrl = await this._Cloudinary.genrateSecureUrl(input.profile_image);
            }
            const updateData = new client_dto_1.ClientUpdateDto({
                email: userDetails.email,
                mobile: input?.mobile || userDetails.mobile || "",
                name: input.name || userDetails.name || "",
                role: userDetails.role,
                user_id: userDetails.user_id,
                address: clientDetails?.address || "",
                dob: input.dob || clientDetails?.dob || "",
                gender: input.gender || clientDetails?.gender || "",
                profile_image: input.profile_image || clientDetails?.profile_image || "",
                is_blocked: userDetails.is_blocked ?? false,
                is_verified: userDetails.is_verified ?? true,
            });
            await this._userRepository.update(updateData);
            await this._clientRepository.update(updateData);
            return {
                ...updateData,
                profile_image: securedUrl || input.profile_image || clientDetails?.profile_image || "",
            };
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.UpdateClientDataUseCase = UpdateClientDataUseCase;
