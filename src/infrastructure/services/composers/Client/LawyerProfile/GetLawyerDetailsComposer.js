"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLawyerDetailComposer = GetLawyerDetailComposer;
const GetLawyerDetailsController_1 = require("@interfaces/controller/Client/GetLawyerDetailsController");
const GetLawyerDetailsUseCase_1 = require("@src/application/usecases/Client/implementations/GetLawyerDetailsUseCase");
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const ClientRepo_1 = require("@infrastructure/database/repo/ClientRepo");
const AddressRepo_1 = require("@infrastructure/database/repo/AddressRepo");
const LawyerRepo_1 = require("@infrastructure/database/repo/LawyerRepo");
const LawyerVerificationRepo_1 = require("@infrastructure/database/repo/LawyerVerificationRepo");
const LawyerVerificaitionMapper_1 = require("@infrastructure/Mapper/Implementations/LawyerVerificaitionMapper");
function GetLawyerDetailComposer() {
    const usecase = new GetLawyerDetailsUseCase_1.GetLawyerDetailsUseCase(new UserRepo_1.UserRepository(), new ClientRepo_1.ClientRepository(), new AddressRepo_1.AddressRepository(), new LawyerRepo_1.LawyerRepository(), new LawyerVerificationRepo_1.LawyerVerificationRepo(new LawyerVerificaitionMapper_1.LawyerVerificationMapper()));
    return new GetLawyerDetailsController_1.GetLawyerDetailController(usecase);
}
