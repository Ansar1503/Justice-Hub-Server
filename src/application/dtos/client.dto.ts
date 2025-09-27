import { Address } from "../../domain/entities/Address";
import { UserDto } from "./user.dto";

export class ClientDto {
    user_id: string;
    profile_image?: string;
    dob?: string;
    gender?: string;
    address?: string;
    constructor({ user_id, profile_image, dob, gender, address }: ClientDto) {
        this.user_id = user_id;
        this.profile_image = profile_image;
        this.address = address;
        this.gender = gender;
        this.dob = dob;
    }
}

export class ClientUpdateDto extends UserDto {
    user_id: string;
    profile_image?: string;
    dob?: string;
    gender?: string;
    address?: string;
    is_verified: boolean;
    is_blocked: boolean;
    password?: string;

    constructor({
        name,
        email,
        mobile,
        role,
        user_id,
        address,
        dob,
        gender,
        profile_image,
        is_blocked,
        is_verified,
        password,
    }: ClientUpdateDto) {
        super({ name, email, mobile, role });
        this.user_id = user_id;
        this.address = address;
        this.dob = dob;
        this.gender = gender;
        this.profile_image = profile_image;
        this.is_blocked = is_blocked;
        this.is_verified = is_verified;
        this.password = password;
    }
}
