"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientUpdateDto = exports.ClientDto = void 0;
const user_dto_1 = require("./user.dto");
class ClientDto {
    user_id;
    profile_image;
    dob;
    gender;
    address;
    constructor({ user_id, profile_image, dob, gender, address }) {
        this.user_id = user_id;
        this.profile_image = profile_image;
        this.address = address;
        this.gender = gender;
        this.dob = dob;
    }
}
exports.ClientDto = ClientDto;
class ClientUpdateDto extends user_dto_1.UserDto {
    user_id;
    profile_image;
    dob;
    gender;
    address;
    is_verified;
    is_blocked;
    password;
    constructor({ name, email, mobile, role, user_id, address, dob, gender, profile_image, is_blocked, is_verified, password, }) {
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
exports.ClientUpdateDto = ClientUpdateDto;
