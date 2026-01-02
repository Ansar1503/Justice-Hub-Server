"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAddressComposer = UpdateAddressComposer;
const UpdateAddressController_1 = require("@interfaces/controller/Client/profile/UpdateAddressController");
const UpdateAddressUseCase_1 = require("@src/application/usecases/Client/implementations/UpdateAddressUseCase");
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const ClientRepo_1 = require("@infrastructure/database/repo/ClientRepo");
const AddressRepo_1 = require("@infrastructure/database/repo/AddressRepo");
function UpdateAddressComposer() {
    const usecase = new UpdateAddressUseCase_1.UpdateAddressUseCase(new UserRepo_1.UserRepository(), new ClientRepo_1.ClientRepository(), new AddressRepo_1.AddressRepository());
    return new UpdateAddressController_1.UpdateAddressController(usecase);
}
