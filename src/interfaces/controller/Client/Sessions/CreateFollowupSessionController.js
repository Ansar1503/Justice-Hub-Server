"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFollowupCheckoutSessionController = void 0;
class CreateFollowupCheckoutSessionController {
    _createFollowupCheckoutSession;
    _errors;
    _success;
    constructor(_createFollowupCheckoutSession, _errors, _success) {
        this._createFollowupCheckoutSession = _createFollowupCheckoutSession;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        try {
            const user_id = httpRequest.user?.id;
            const { lawyer_id, date, timeSlot, duration, reason, caseId } = httpRequest.body || {};
            if (!lawyer_id ||
                !date ||
                !timeSlot ||
                !user_id ||
                !duration ||
                !reason ||
                !caseId) {
                return this._errors.error_400("Invalid Credentials");
            }
            const dateObj = new Date(new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000);
            const response = await this._createFollowupCheckoutSession.execute({
                client_id: user_id,
                date: dateObj,
                duration,
                lawyer_id,
                reason,
                timeSlot,
                caseId,
            });
            return this._success.success_200(response);
        }
        catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
exports.CreateFollowupCheckoutSessionController = CreateFollowupCheckoutSessionController;
