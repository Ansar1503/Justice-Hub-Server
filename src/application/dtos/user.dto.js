"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResposeUserDto = exports.RegisterUserDto = exports.UserDto = void 0;
class UserDto {
    name;
    email;
    mobile;
    role;
    constructor({ name, email, mobile, role }) {
        this.email = email;
        this.mobile = mobile;
        this.name = name;
        this.role = role;
    }
}
exports.UserDto = UserDto;
class RegisterUserDto extends UserDto {
    password;
    constructor({ name, email, mobile, role, password }) {
        super({ name, email, mobile, role });
        this.password = password;
    }
}
exports.RegisterUserDto = RegisterUserDto;
class ResposeUserDto {
    user_id;
    name;
    email;
    role;
    constructor({ user_id, name, email, role }) {
        this.user_id = user_id;
        this.name = name;
        this.email = email;
        this.role = role;
    }
}
exports.ResposeUserDto = ResposeUserDto;
