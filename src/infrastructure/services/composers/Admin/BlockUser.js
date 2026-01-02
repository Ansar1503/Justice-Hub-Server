"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockUserComposer = BlockUserComposer;
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const UserMapper_1 = require("@infrastructure/Mapper/Implementations/UserMapper");
const BlockUser_1 = require("@interfaces/controller/Admin/BlockUser");
const BlockUserUseCase_1 = require("@src/application/usecases/Admin/Implementations/BlockUserUseCase");
function BlockUserComposer() {
    const mapper = new UserMapper_1.UserMapper();
    const repo = new UserRepo_1.UserRepository(mapper);
    const usecase = new BlockUserUseCase_1.BlockUserUseCase(repo);
    const controller = new BlockUser_1.BlockUser(usecase);
    return controller;
}
