"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleWebhookComposer = HandleWebhookComposer;
const StripeWebhookController_1 = require("@interfaces/controller/Client/StripeWebhookController");
const HandleStripeHooksUseCase_1 = require("@src/application/usecases/Client/implementations/HandleStripeHooksUseCase");
const ScheduleSettingsRepo_1 = require("@infrastructure/database/repo/ScheduleSettingsRepo");
const UnitofWork_1 = require("@infrastructure/database/UnitofWork/implementations/UnitofWork");
function HandleWebhookComposer() {
    const usecase = new HandleStripeHooksUseCase_1.HandleStripeHookUseCase(new ScheduleSettingsRepo_1.ScheduleSettingsRepository(), new UnitofWork_1.MongoUnitofWork());
    return new StripeWebhookController_1.HandleWebhookController(usecase);
}
