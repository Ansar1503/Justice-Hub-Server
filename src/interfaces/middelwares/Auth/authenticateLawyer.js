"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateLawyer = authenticateLawyer;
const UserMapper_1 = require("@infrastructure/Mapper/Implementations/UserMapper");
const LawyerVerificationRepo_1 = require("@infrastructure/database/repo/LawyerVerificationRepo");
const LawyerVerificaitionMapper_1 = require("@infrastructure/Mapper/Implementations/LawyerVerificaitionMapper");
const UserRepo_1 = require("../../../infrastructure/database/repo/UserRepo");
const status_codes_1 = require("../../../infrastructure/constant/status.codes");
const userRepo = new UserRepo_1.UserRepository(new UserMapper_1.UserMapper());
const lawyerverificationsRepo = new LawyerVerificationRepo_1.LawyerVerificationRepo(new LawyerVerificaitionMapper_1.LawyerVerificationMapper());
async function authenticateLawyer(req, res, next) {
    // console.log("lawyer getting authenticated")
    const lawyer_id = req.user.id;
    if (!lawyer_id) {
        res.status(status_codes_1.STATUS_CODES.FORBIDDEN).json({
            success: false,
            message: "Unauthorized",
        });
        return;
    }
    const user = await userRepo.findByuser_id(lawyer_id);
    if (!user) {
        res.status(status_codes_1.STATUS_CODES.NOT_FOUND).json({
            success: false,
            message: "lawyer not found",
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
    const lawyer = await lawyerverificationsRepo.findByUserId(lawyer_id);
    if (!lawyer) {
        res.status(status_codes_1.STATUS_CODES.NOT_FOUND).json({
            success: false,
            message: "lawyer not found",
        });
        return;
    }
    if (lawyer.verificationStatus !== "verified") {
        res.status(status_codes_1.STATUS_CODES.FORBIDDEN).json({
            success: false,
            message: "Lawyer are not verified",
        });
        return;
    }
    next();
}
