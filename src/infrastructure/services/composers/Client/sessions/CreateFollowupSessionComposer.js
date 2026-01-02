"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFollowupCheckoutSessionComposer = CreateFollowupCheckoutSessionComposer;
const AppointmentsRepo_1 = require("@infrastructure/database/repo/AppointmentsRepo");
const AvailableSlotsRepo_1 = require("@infrastructure/database/repo/AvailableSlotsRepo");
const CommissionSettingsRepo_1 = require("@infrastructure/database/repo/CommissionSettingsRepo");
const LawyerRepo_1 = require("@infrastructure/database/repo/LawyerRepo");
const LawyerVerificationRepo_1 = require("@infrastructure/database/repo/LawyerVerificationRepo");
const OverrideSlotsRepo_1 = require("@infrastructure/database/repo/OverrideSlotsRepo");
const ScheduleSettingsRepo_1 = require("@infrastructure/database/repo/ScheduleSettingsRepo");
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const UserSubscriptionRepository_1 = require("@infrastructure/database/repo/UserSubscriptionRepository");
const WalletRepo_1 = require("@infrastructure/database/repo/WalletRepo");
const CommissionSettingsMapper_1 = require("@infrastructure/Mapper/Implementations/CommissionSettingsMapper");
const LawyerVerificaitionMapper_1 = require("@infrastructure/Mapper/Implementations/LawyerVerificaitionMapper");
const UserSubscriptionMapper_1 = require("@infrastructure/Mapper/Implementations/UserSubscriptionMapper");
const RedisConfig_1 = require("@infrastructure/Redis/Config/RedisConfig");
const RedisService_1 = require("@infrastructure/Redis/RedisService");
const CreateFollowupSessionController_1 = require("@interfaces/controller/Client/Sessions/CreateFollowupSessionController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const CreateFollowupSessionUsecase_1 = require("@src/application/usecases/Client/implementations/CreateFollowupSessionUsecase");
async function CreateFollowupCheckoutSessionComposer() {
    const client = await (0, RedisConfig_1.connectRedis)();
    const usecase = new CreateFollowupSessionUsecase_1.CreateFollowupCheckoutSessionUsecase(new UserRepo_1.UserRepository(), new LawyerVerificationRepo_1.LawyerVerificationRepo(new LawyerVerificaitionMapper_1.LawyerVerificationMapper()), new AppointmentsRepo_1.AppointmentsRepository(), new ScheduleSettingsRepo_1.ScheduleSettingsRepository(), new AvailableSlotsRepo_1.AvailableSlotRepository(), new OverrideSlotsRepo_1.OverrideSlotsRepository(), new WalletRepo_1.WalletRepo(), new LawyerRepo_1.LawyerRepository(), new RedisService_1.RedisService(client), new CommissionSettingsRepo_1.CommissionSettingsRepo(new CommissionSettingsMapper_1.CommissionSettingsMapper()), new UserSubscriptionRepository_1.UserSubscriptionRepository(new UserSubscriptionMapper_1.UserSubscriptionMapper()));
    return new CreateFollowupSessionController_1.CreateFollowupCheckoutSessionController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
