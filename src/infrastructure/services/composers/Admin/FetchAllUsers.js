"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAllUserComposer = FetchAllUserComposer;
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const UserMapper_1 = require("@infrastructure/Mapper/Implementations/UserMapper");
const FetchUsers_1 = require("@interfaces/controller/Admin/FetchUsers");
const FetchUsersUseCase_1 = require("@src/application/usecases/Admin/Implementations/FetchUsersUseCase");
function FetchAllUserComposer() {
    const mapper = new UserMapper_1.UserMapper();
    const repo = new UserRepo_1.UserRepository(mapper);
    const usecase = new FetchUsersUseCase_1.FetchUsersUseCase(repo);
    return new FetchUsers_1.FetchALLUsers(usecase);
}
