"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEmailComposer = UpdateEmailComposer;
const UpdateMailController_1 = require("@interfaces/controller/Client/profile/UpdateMailController");
const ChangeMailUseCase_1 = require("@src/application/usecases/Client/implementations/ChangeMailUseCase");
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const NodeMailerProvider_1 = require("@infrastructure/Providers/NodeMailerProvider");
const JwtProvider_1 = require("@infrastructure/Providers/JwtProvider");
function UpdateEmailComposer() {
    const usecase = new ChangeMailUseCase_1.ChangeMailUseCase(new UserRepo_1.UserRepository(), new NodeMailerProvider_1.NodeMailerProvider(), new JwtProvider_1.JwtProvider());
    return new UpdateMailController_1.UpdateEmailController(usecase);
}
