"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLawyerSlotDetailsComposer = void 0;
const GetLawyerSlotDetailsController_1 = require("@interfaces/controller/Client/GetLawyerSlotDetailsController");
const FetchLawyerSlotsUseCase_1 = require("@src/application/usecases/Client/implementations/FetchLawyerSlotsUseCase");
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const ScheduleSettingsRepo_1 = require("@infrastructure/database/repo/ScheduleSettingsRepo");
const AppointmentsRepo_1 = require("@infrastructure/database/repo/AppointmentsRepo");
const OverrideSlotsRepo_1 = require("@infrastructure/database/repo/OverrideSlotsRepo");
const AvailableSlotsRepo_1 = require("@infrastructure/database/repo/AvailableSlotsRepo");
const LawyerVerificationRepo_1 = require("@infrastructure/database/repo/LawyerVerificationRepo");
const LawyerVerificaitionMapper_1 = require("@infrastructure/Mapper/Implementations/LawyerVerificaitionMapper");
const GetLawyerSlotDetailsComposer = () => {
    const useCase = new FetchLawyerSlotsUseCase_1.FetchLawyerSlotsUseCase(new UserRepo_1.UserRepository(), new LawyerVerificationRepo_1.LawyerVerificationRepo(new LawyerVerificaitionMapper_1.LawyerVerificationMapper()), new ScheduleSettingsRepo_1.ScheduleSettingsRepository(), new AppointmentsRepo_1.AppointmentsRepository(), new OverrideSlotsRepo_1.OverrideSlotsRepository(), new AvailableSlotsRepo_1.AvailableSlotRepository());
    return new GetLawyerSlotDetailsController_1.GetLawyerSlotDetailsController(useCase);
};
exports.GetLawyerSlotDetailsComposer = GetLawyerSlotDetailsComposer;
