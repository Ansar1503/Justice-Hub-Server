"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateSalesReportUsecase = void 0;
class GenerateSalesReportUsecase {
    _reportService;
    _commissionRepo;
    constructor(_reportService, _commissionRepo) {
        this._reportService = _reportService;
        this._commissionRepo = _commissionRepo;
    }
    async execute(input) {
        const { startDate, endDate, format } = input;
        const transactions = await this._commissionRepo.getSalesReport(startDate, endDate);
        if (!transactions || transactions.length === 0) {
            throw new Error("No sales transactions found for the selected period.");
        }
        const rows = transactions.map((t) => ({
            date: t.createdAt.toISOString().split("T")[0],
            bookingId: t.bookingId,
            lawyerId: t.lawyerId,
            lawyerName: t.lawyerName ?? "Unknown",
            clientId: t.clientId,
            clientName: t.clientName ?? "Unknown",
            type: t.type,
            baseFee: t.baseFee,
            subscriptionDiscount: t.subscriptionDiscount ?? 0,
            followupDiscount: t.followupDiscount ?? 0,
            amountPaid: t.amountPaid,
            commissionPercent: t.commissionPercent,
            commissionAmount: t.commissionAmount,
            lawyerAmount: t.lawyerAmount,
            status: t.status,
        }));
        const summary = {
            totalPaid: rows.reduce((sum, r) => sum + r.amountPaid, 0),
            totalCommission: rows.reduce((sum, r) => sum + r.commissionAmount, 0),
            totalLawyerShare: rows.reduce((sum, r) => sum + r.lawyerAmount, 0),
            totalBookings: rows.length,
        };
        const generator = this._reportService.get(format);
        const buffer = await generator.generateReport(rows, summary);
        return {
            buffer,
            mimeType: generator.getMimeType(),
            fileExtension: generator.getFileExtension(),
            filename: `sales-report-${startDate}-to-${endDate}.${generator.getFileExtension()}`,
        };
    }
}
exports.GenerateSalesReportUsecase = GenerateSalesReportUsecase;
