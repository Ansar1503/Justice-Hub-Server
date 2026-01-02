"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadSalesReportController = void 0;
class DownloadSalesReportController {
    usecase;
    _errors;
    _success;
    constructor(usecase, _errors, _success) {
        this.usecase = usecase;
        this._errors = _errors;
        this._success = _success;
    }
    async handle(httpRequest) {
        try {
            const { startDate, endDate, format } = httpRequest.query;
            if (!startDate || !endDate || !format) {
                return this._errors.error_400("Invalid credentials");
            }
            const result = await this.usecase.execute({
                startDate,
                endDate,
                format,
            });
            const base64 = result.buffer.toString("base64");
            return this._success.success_200({
                file: base64,
                mimeType: result.mimeType,
                filename: result.filename,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
exports.DownloadSalesReportController = DownloadSalesReportController;
