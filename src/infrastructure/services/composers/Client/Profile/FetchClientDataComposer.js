"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchClientDataComposer = FetchClientDataComposer;
const FetchClientController_1 = require("@interfaces/controller/Client/profile/FetchClientController");
const FetchClientDataUseCase_1 = require("@src/application/usecases/Client/implementations/FetchClientDataUseCase");
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const ClientRepo_1 = require("@infrastructure/database/repo/ClientRepo");
const AddressRepo_1 = require("@infrastructure/database/repo/AddressRepo");
const LawyerVerificationRepo_1 = require("@infrastructure/database/repo/LawyerVerificationRepo");
const LawyerVerificaitionMapper_1 = require("@infrastructure/Mapper/Implementations/LawyerVerificaitionMapper");
function FetchClientDataComposer() {
    const usecase = new FetchClientDataUseCase_1.FetchClientDataUseCaseDto(new UserRepo_1.UserRepository(), new ClientRepo_1.ClientRepository(), new AddressRepo_1.AddressRepository(), new LawyerVerificationRepo_1.LawyerVerificationRepo(new LawyerVerificaitionMapper_1.LawyerVerificationMapper()));
    const controller = new FetchClientController_1.FetchClientDataController(usecase);
    return controller;
}
