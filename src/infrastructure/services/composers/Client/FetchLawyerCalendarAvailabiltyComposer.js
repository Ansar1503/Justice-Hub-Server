"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchLawyerCalendarAvailabilityComposer = FetchLawyerCalendarAvailabilityComposer;
const LawyerVerificaitionMapper_1 = require("@infrastructure/Mapper/Implementations/LawyerVerificaitionMapper");
const AppointmentsRepo_1 = require("@infrastructure/database/repo/AppointmentsRepo");
const AvailableSlotsRepo_1 = require("@infrastructure/database/repo/AvailableSlotsRepo");
const LawyerVerificationRepo_1 = require("@infrastructure/database/repo/LawyerVerificationRepo");
const OverrideSlotsRepo_1 = require("@infrastructure/database/repo/OverrideSlotsRepo");
const ScheduleSettingsRepo_1 = require("@infrastructure/database/repo/ScheduleSettingsRepo");
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const FetchLawyerCalendarAvailabilityController_1 = require("@interfaces/controller/Client/FetchLawyerCalendarAvailabilityController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FetchAvailableSlotsForBookingUsecase_1 = require("@src/application/usecases/Client/implementations/FetchAvailableSlotsForBookingUsecase");
function FetchLawyerCalendarAvailabilityComposer() {
    const usecase = new FetchAvailableSlotsForBookingUsecase_1.FetchLawyerCalendarAvailabilityUseCase(new UserRepo_1.UserRepository(), new LawyerVerificationRepo_1.LawyerVerificationRepo(new LawyerVerificaitionMapper_1.LawyerVerificationMapper()), new ScheduleSettingsRepo_1.ScheduleSettingsRepository(), new AvailableSlotsRepo_1.AvailableSlotRepository(), new OverrideSlotsRepo_1.OverrideSlotsRepository(), new AppointmentsRepo_1.AppointmentsRepository());
    return new FetchLawyerCalendarAvailabilityController_1.FetchLawyerCalendarAvailabilityController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
