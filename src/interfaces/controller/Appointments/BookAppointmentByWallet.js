"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookAppointmentByWalletController = void 0;
const BookAppointmentByWalletSchema_1 = require("@interfaces/middelwares/validator/zod/Appointments/BookAppointmentByWalletSchema");
class BookAppointmentByWalletController {
    _bookAppointmentUsecase;
    _errors;
    _success;
    constructor(_bookAppointmentUsecase, _errors, _success) {
        this._bookAppointmentUsecase = _bookAppointmentUsecase;
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
        const parsed = BookAppointmentByWalletSchema_1.BookAppointmentsByWalletZodSchema.safeParse(httpRequest.body);
        if (!userId) {
            return this._errors.error_400("no userId found");
        }
        if (!parsed.success) {
            const er = parsed.error.errors[0];
            return this._errors.error_400(er.message);
        }
        try {
            const result = await this._bookAppointmentUsecase.execute({
                ...parsed.data,
                caseId: parsed.data.caseTypeId,
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
exports.BookAppointmentByWalletController = BookAppointmentByWalletController;
