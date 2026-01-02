"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePasswordComposer = UpdatePasswordComposer;
const UpdatePassword_1 = require("@interfaces/controller/Client/profile/UpdatePassword");
const UpdatePasswordUseCase_1 = require("@src/application/usecases/Client/implementations/UpdatePasswordUseCase");
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const ClientRepo_1 = require("@infrastructure/database/repo/ClientRepo");
const PasswordHasher_1 = require("@infrastructure/Providers/PasswordHasher");
function UpdatePasswordComposer() {
    const usecase = new UpdatePasswordUseCase_1.UpdatePasswordUseCase(new UserRepo_1.UserRepository(), new ClientRepo_1.ClientRepository(), new PasswordHasher_1.PasswordManager());
    return new UpdatePassword_1.UpdatePasswordController(usecase);
}
