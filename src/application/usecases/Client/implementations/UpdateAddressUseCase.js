"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAddressUseCase = void 0;
const Address_1 = require("@domain/entities/Address");
const client_dto_1 = require("@src/application/dtos/client.dto");
class UpdateAddressUseCase {
    userRepository;
    clientRepository;
    addressRepository;
    constructor(userRepository, clientRepository, addressRepository) {
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.addressRepository = addressRepository;
    }
    async execute(input) {
        const userDetails = await this.userRepository.findByuser_id(input.user_id);
        const clientDetails = await this.clientRepository.findByUserId(input.user_id);
        if (!userDetails) {
            throw new Error("USER_NOT_FOUND");
        }
        if (userDetails.is_blocked) {
            throw new Error("USER_BLOCKED");
        }
        const addresspayload = Address_1.Address.create({
            user_id: input.user_id,
            city: input.city,
            locality: input.locality,
            pincode: input.pincode,
            state: input.state,
        });
        const updatedAddress = await this.addressRepository.update(addresspayload);
        const updateData = new client_dto_1.ClientUpdateDto({
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
        await this.clientRepository.update(updateData);
    }
}
exports.UpdateAddressUseCase = UpdateAddressUseCase;
