"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookFollowupAppointmentByWalletController = void 0;
const BookAppointmentByWalletSchema_1 = require("@interfaces/middelwares/validator/zod/Appointments/BookAppointmentByWalletSchema");
class BookFollowupAppointmentByWalletController {
    _usecase;
    _errors;
    _success;
    constructor(_usecase, _errors, _success) {
        this._usecase = _usecase;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        let userId = "";
        if (httpRequest.user &&
            typeof httpRequest.user === "object" &&
            "id" in httpRequest.user) {
            userId = String(httpRequest.user.id);
        }
        if (!userId) {
            return this._errors.error_400("No userId found");
        }
        const parsed = BookAppointmentByWalletSchema_1.BookFollowupAppointmentByWalletZodSchema.safeParse(httpRequest.body);
        if (!parsed.success) {
            return this._errors.error_400(parsed.error.errors[0].message);
        }
        try {
            const result = await this._usecase.execute({
                ...parsed.data,
                client_id: userId,
            });
            return this._success.success_200(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
exports.BookFollowupAppointmentByWalletController = BookFollowupAppointmentByWalletController;
