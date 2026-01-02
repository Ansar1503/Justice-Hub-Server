"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
const User_1 = require("@domain/entities/User");
class UserMapper {
    toDomain(raw) {
        return User_1.User.fromPersistence({
            id: raw._id.toString(),
            user_id: raw.user_id,
            email: raw.email,
            name: raw.name,
            mobile: raw.mobile,
            password: raw.password,
            role: raw.role,
            is_blocked: raw.is_blocked,
            is_verified: raw.is_verified,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }
    toPersistence(raw) {
        return {
            _id: raw.id,
            user_id: raw.user_id,
            name: raw.name,
            email: raw.email,
            mobile: raw.mobile,
            password: raw.password,
            role: raw.role,
            is_blocked: raw.is_blocked,
            is_verified: raw.is_verified,
        };
    }
    toDomainArray(raw) {
        return raw.map((r) => this.toDomain(r));
    }
}
exports.UserMapper = UserMapper;
