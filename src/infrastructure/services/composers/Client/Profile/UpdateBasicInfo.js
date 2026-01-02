"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClientDataComposer = updateClientDataComposer;
const UpdateBasicInfo_1 = require("@interfaces/controller/Client/profile/UpdateBasicInfo");
const UpdateClientDataUseCase_1 = require("@src/application/usecases/Client/implementations/UpdateClientDataUseCase");
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const ClientRepo_1 = require("@infrastructure/database/repo/ClientRepo");
const cloudinary_service_1 = require("@src/application/services/cloudinary.service");
function updateClientDataComposer() {
    const usecase = new UpdateClientDataUseCase_1.UpdateClientDataUseCase(new UserRepo_1.UserRepository(), new ClientRepo_1.ClientRepository(), new cloudinary_service_1.CloudinaryService());
    return new UpdateBasicInfo_1.UpdateBasicInfoController(usecase);
}
