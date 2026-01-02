"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendVerificationMailComposer = SendVerificationMailComposer;
const SendVerificationMailController_1 = require("@interfaces/controller/Client/profile/SendVerificationMailController");
const VerifyMailUseCase_1 = require("@src/application/usecases/Client/implementations/VerifyMailUseCase");
const NodeMailerProvider_1 = require("@infrastructure/Providers/NodeMailerProvider");
const JwtProvider_1 = require("@infrastructure/Providers/JwtProvider");
function SendVerificationMailComposer() {
    const usecase = new VerifyMailUseCase_1.VerifyMailUseCase(new NodeMailerProvider_1.NodeMailerProvider(), new JwtProvider_1.JwtProvider());
    return new SendVerificationMailController_1.SendVerificationMailController(usecase);
}
