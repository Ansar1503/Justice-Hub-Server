"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAllLawyersComposer = FetchAllLawyersComposer;
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const UserMapper_1 = require("@infrastructure/Mapper/Implementations/UserMapper");
const FetchAllLawyers_1 = require("@interfaces/controller/Admin/FetchAllLawyers");
const FetchLawyersUseCase_1 = require("@src/application/usecases/Admin/Implementations/FetchLawyersUseCase");
function FetchAllLawyersComposer() {
    const mapper = new UserMapper_1.UserMapper();
    const repo = new UserRepo_1.UserRepository(mapper);
    const useCase = new FetchLawyersUseCase_1.FetchLawyersUseCase(repo);
    const controller = new FetchAllLawyers_1.FetchAllLawyers(useCase);
    return controller;
}
