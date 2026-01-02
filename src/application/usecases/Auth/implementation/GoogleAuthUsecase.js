"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthUsecase = void 0;
const User_1 = require("@domain/entities/User");
const Client_1 = require("@domain/entities/Client");
const Wallet_1 = require("@domain/entities/Wallet");
const UserSubscriptionPlan_1 = require("@domain/entities/UserSubscriptionPlan");
class GoogleAuthUsecase {
    _googleProvider;
    _jwtProvider;
    _uow;
    constructor(_googleProvider, _jwtProvider, _uow) {
        this._googleProvider = _googleProvider;
        this._jwtProvider = _jwtProvider;
        this._uow = _uow;
    }
    async execute(input) {
        const googleUser = await this._googleProvider.verifyToken(input.credential);
        if (!googleUser.email)
            throw new Error("Google email not found");
        const email = googleUser.email;
        const name = googleUser.name || email.split("@")[0];
        return this._uow.startTransaction(async (uow) => {
            let user = await uow.userRepo.findByEmail(email);
            if (!user) {
                user = User_1.User.create({
                    name,
                    email,
                    mobile: "",
                    password: "google",
                    role: "client",
                });
                user.verify();
                try {
                    await uow.userRepo.create(user);
                }
                catch (error) {
                    throw new Error("Database Error creating user");
                }
                try {
                    const client = Client_1.Client.create({
                        address: "",
                        dob: "",
                        gender: "",
                        profile_image: "",
                        user_id: user.user_id,
                    });
                    await uow.clientRepo.create(client);
                }
                catch (error) {
                    throw new Error("Database Error creating client");
                }
            }
            if (user.is_blocked) {
                throw new Error("User is blocked");
            }
            const client = await uow.clientRepo.findByUserId(user.user_id);
            if (!client) {
                try {
                    const client = Client_1.Client.create({
                        address: "",
                        dob: "",
                        gender: "",
                        profile_image: "",
                        user_id: user.user_id,
                    });
                    await uow.clientRepo.create(client);
                }
                catch (error) {
                    throw new Error("Database Error creating client");
                }
            }
            const clientwallet = Wallet_1.Wallet.create({
                user_id: user.user_id,
            });
            await uow.walletRepo.create(clientwallet);
            const freePlan = await uow.subscriptionRepo.findFreeTier();
            if (freePlan) {
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + 30);
                const benefits = freePlan.benefits;
                const userSub = UserSubscriptionPlan_1.UserSubscription.create({
                    benefitsSnapshot: {
                        autoRenew: benefits.autoRenew,
                        bookingsPerMonth: benefits.bookingsPerMonth,
                        chatAccess: benefits.chatAccess,
                        discountPercent: benefits.discountPercent,
                        documentUploadLimit: benefits.documentUploadLimit,
                        expiryAlert: benefits.expiryAlert,
                        followupBookingsPerCase: benefits.followupBookingsPerCase,
                    },
                    userId: user.user_id,
                    planId: freePlan.id,
                    startDate: new Date(),
                    autoRenew: false,
                    endDate: endDate,
                });
                await uow.userSubscriptionRepo.create(userSub);
            }
            const accesstoken = await this._jwtProvider.GenerateAccessToken({
                email: user.email,
                id: user.user_id,
                role: user.role,
                status: user.is_verified,
            });
            const refreshToken = await this._jwtProvider.GenerateRefreshToken({
                email: user.email,
                id: user.user_id,
                role: user.role,
                status: user.is_verified,
            });
            return {
                accesstoken,
                refreshToken,
                user: {
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    user_id: user.user_id,
                },
            };
        });
    }
}
exports.GoogleAuthUsecase = GoogleAuthUsecase;
