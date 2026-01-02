"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCheckoutSessionController = void 0;
class CreateCheckoutSessionController {
    _createCheckoutSession;
    _errors;
    _success;
    constructor(_createCheckoutSession, _errors, _success) {
        this._createCheckoutSession = _createCheckoutSession;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        try {
            const user_id = httpRequest.user?.id;
            const { lawyer_id, date, timeSlot, duration, reason, caseTypeId, title } = httpRequest.body || {};
            if (!lawyer_id || !date || !timeSlot || !user_id || !duration || !reason || !title || !caseTypeId) {
                return this._errors.error_400("Invalid Credentials");
            }
            const dateObj = new Date(new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000);
            const response = await this._createCheckoutSession.execute({
                client_id: user_id,
                date: dateObj,
                duration,
                lawyer_id,
                reason,
                timeSlot,
                caseId: caseTypeId,
                title: title,
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
exports.CreateCheckoutSessionController = CreateCheckoutSessionController;
