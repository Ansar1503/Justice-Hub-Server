"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchChatDisputesComposer = FetchChatDisputesComposer;
const DisputesRepo_1 = require("@infrastructure/database/repo/DisputesRepo");
const FetchChatDisputes_1 = require("@interfaces/controller/Admin/FetchChatDisputes");
const FetchChatDisputesUseCase_1 = require("@src/application/usecases/Admin/Implementations/FetchChatDisputesUseCase");
function FetchChatDisputesComposer() {
    const usecase = new FetchChatDisputesUseCase_1.FetchChatDisputesUseCase(new DisputesRepo_1.DisputesRepo());
    return new FetchChatDisputes_1.FetchChatDisputesController(usecase);
}
