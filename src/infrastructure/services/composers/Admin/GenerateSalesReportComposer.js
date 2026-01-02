"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateSalesReportComposer = GenerateSalesReportComposer;
const CommissionTransactionRepo_1 = require("@infrastructure/database/repo/CommissionTransactionRepo");
const CommissionTransactionMapper_1 = require("@infrastructure/Mapper/Implementations/CommissionTransactionMapper");
const PdfReportGenerator_1 = require("@infrastructure/Providers/PdfReportGenerator");
const ReportService_1 = require("@infrastructure/Providers/ReportService");
const XlsReportGenerator_1 = require("@infrastructure/Providers/XlsReportGenerator");
const GenerateSalesReportController_1 = require("@interfaces/controller/Admin/GenerateSalesReportController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const GenerateSalesReportUsecase_1 = require("@src/application/usecases/Admin/Implementations/GenerateSalesReportUsecase");
function GenerateSalesReportComposer() {
    const reportService = new ReportService_1.ReportService();
    reportService.register("pdf", new PdfReportGenerator_1.PdfReportGenerator());
    reportService.register("xls", new XlsReportGenerator_1.XlsReportGenerator());
    const usecase = new GenerateSalesReportUsecase_1.GenerateSalesReportUsecase(reportService, new CommissionTransactionRepo_1.CommissionTransactionRepo(new CommissionTransactionMapper_1.CommissionTransactionMapper()));
    return new GenerateSalesReportController_1.DownloadSalesReportController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
