import { AddressInputDto } from "@src/application/dtos/AdressDto";
import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { IClientRepository } from "@domain/IRepository/IClientRepo";
import { IAddressRepository } from "@domain/IRepository/IAddressRepo";
import { Address } from "@domain/entities/Address";
import { ClientUpdateDto } from "@src/application/dtos/client.dto";
import { IUpdateAddressUseCase } from "../IUpdateAddressUseCase";

export class UpdateAddressUseCase implements IUpdateAddressUseCase {
    constructor(
        private _userRepository: IUserRepository,
        private _clientRepository: IClientRepository,
        private _addressRepository: IAddressRepository,
    ) {}
    async execute(input: AddressInputDto): Promise<void> {
        const userDetails = await this._userRepository.findByuser_id(input.user_id);
        const clientDetails = await this._clientRepository.findByUserId(input.user_id);
        if (!userDetails) {
            throw new Error("USER_NOT_FOUND");
        }

        if (userDetails.is_blocked) {
            throw new Error("USER_BLOCKED");
        }
        const addresspayload = Address.create({
            user_id: input.user_id,
            city: input.city,
            locality: input.locality,
            pincode: input.pincode,
            state: input.state,
        });
        const updatedAddress = await this._addressRepository.update(addresspayload);
        const updateData = new ClientUpdateDto({
            email: userDetails.email,
            mobile: userDetails.mobile || "",
            name: userDetails.name,
            role: userDetails.role,
            user_id: userDetails.user_id,
            address: updatedAddress.id,
            profile_image: clientDetails?.profile_image || "",
            dob: clientDetails?.dob || "",
            gender: clientDetails?.gender || "",
            is_blocked: userDetails.is_blocked,
            is_verified: userDetails.is_blocked,
        });
        await this._clientRepository.update(updateData);
    }
}
