"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchClientDataUseCaseDto = void 0;
const client_dto_1 = require("@src/application/dtos/client.dto");
class FetchClientDataUseCaseDto {
    userRepository;
    clientRepository;
    addressRepository;
    lawyerRepository;
    constructor(userRepository, clientRepository, addressRepository, lawyerRepository) {
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.addressRepository = addressRepository;
        this.lawyerRepository = lawyerRepository;
    }
    async execute(input) {
        try {
            const userDetails = await this.userRepository.findByuser_id(input);
            if (!userDetails) {
                throw new Error("USER_NOT_FOUND");
            }
            const clientdetails = await this.clientRepository.findByUserId(input);
            const addressDetails = await this.addressRepository.find(input);
            let lawyerVerfication;
            let rejectReason;
            if (userDetails.role === "lawyer") {
                const lawyerData = await this.lawyerRepository.findByUserId(input);
                lawyerVerfication = lawyerData?.verificationStatus;
                rejectReason = lawyerData?.rejectReason;
            }
            if (!clientdetails) {
                throw new Error("CLIENT_NOT_FOUND");
            }
            const address = {
                city: addressDetails?.city || "",
                locality: addressDetails?.locality || "",
                state: addressDetails?.state || "",
                pincode: addressDetails?.pincode || "",
            };
            const responseClientData = new client_dto_1.ClientUpdateDto({
                email: userDetails.email || "",
                mobile: userDetails.mobile || "",
                name: userDetails.name || "",
                role: userDetails.role,
                user_id: input,
                address: clientdetails.address || "",
                dob: clientdetails.dob || "",
                gender: clientdetails.gender || "",
                profile_image: clientdetails.profile_image || "",
                is_blocked: userDetails.is_blocked ?? false,
                is_verified: userDetails.is_verified ?? true,
            });
            return {
                ...responseClientData,
                address,
                lawyerVerfication,
                rejectReason: rejectReason ?? "",
            };
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.FetchClientDataUseCaseDto = FetchClientDataUseCaseDto;
