"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateClient = authenticateClient;
const UserMapper_1 = require("@infrastructure/Mapper/Implementations/UserMapper");
const status_codes_1 = require("../../../infrastructure/constant/status.codes");
const UserRepo_1 = require("../../../infrastructure/database/repo/UserRepo");
const userRepo = new UserRepo_1.UserRepository(new UserMapper_1.UserMapper());
async function authenticateClient(req, res, next) {
    const client_id = req.user.id;
    if (!client_id) {
        res.status(status_codes_1.STATUS_CODES.FORBIDDEN).json({
            success: false,
            message: "Unauthorized",
        });
        return;
    }
    const user = await userRepo.findByuser_id(client_id);
    if (!user) {
        res.status(status_codes_1.STATUS_CODES.NOT_FOUND).json({
            success: false,
            message: "user not found",
        });
        return;
    }
    if (user.is_blocked) {
        res.status(status_codes_1.STATUS_CODES.FORBIDDEN).json({
            success: false,
            message: "You are blocked",
        });
        return;
    }
    next();
}
