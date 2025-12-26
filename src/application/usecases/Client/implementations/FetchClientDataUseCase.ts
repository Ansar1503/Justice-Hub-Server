import { FetchClientDto } from "@src/application/dtos/client/FetchClientDto";
import { ClientUpdateDto } from "@src/application/dtos/client.dto";
import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { IClientRepository } from "@domain/IRepository/IClientRepo";
import { IAddressRepository } from "@domain/IRepository/IAddressRepo";
import { ILawyerVerificationRepo } from "@domain/IRepository/ILawyerVerificationRepo";
import { IFetchClientDataUseCase } from "../IFetchClientData";

export class FetchClientDataUseCaseDto implements IFetchClientDataUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _clientRepository: IClientRepository,
        private _addressRepository: IAddressRepository,
        private _lawyerRepository: ILawyerVerificationRepo,
    ) {}
    async execute(input: string): Promise<FetchClientDto> {
        try {
            const userDetails = await this._userRepository.findByuser_id(input);
            if (!userDetails) {
                throw new Error("USER_NOT_FOUND");
            }
            const clientdetails = await this._clientRepository.findByUserId(input);
            const addressDetails = await this._addressRepository.find(input);
            let lawyerVerfication;
            let rejectReason;
            if (userDetails.role === "lawyer") {
                const lawyerData = await this._lawyerRepository.findByUserId(input);
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
            const responseClientData = new ClientUpdateDto({
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
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
