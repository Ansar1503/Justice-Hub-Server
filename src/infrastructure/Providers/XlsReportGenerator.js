"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XlsReportGenerator = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
class XlsReportGenerator {
    async generateReport(data, summary) {
        const workbook = new exceljs_1.default.Workbook();
        const sheet = workbook.addWorksheet("Sales Report");
        sheet.columns = [
            { header: "Date", key: "date", width: 15 },
            { header: "Booking ID", key: "bookingId", width: 20 },
            { header: "Lawyer ID", key: "lawyerId", width: 20 },
            { header: "Lawyer Name", key: "lawyerName", width: 25 },
            { header: "Client ID", key: "clientId", width: 20 },
            { header: "Type", key: "type", width: 12 },
            { header: "Base Fee (₹)", key: "baseFee", width: 15 },
            {
                header: "Subscription Discount (₹)",
                key: "subscriptionDiscount",
                width: 20,
            },
            { header: "Follow-up Discount (₹)", key: "followupDiscount", width: 20 },
            { header: "Amount Paid (₹)", key: "amountPaid", width: 18 },
            { header: "Commission %", key: "commissionPercent", width: 15 },
            { header: "Admin Commission (₹)", key: "commissionAmount", width: 20 },
            { header: "Lawyer Payout (₹)", key: "lawyerAmount", width: 20 },
            { header: "Status", key: "status", width: 15 },
        ];
        const headerRow = sheet.getRow(1);
        headerRow.font = { bold: true, size: 12 };
        headerRow.alignment = { vertical: "middle", horizontal: "center" };
        headerRow.eachCell((cell) => {
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFDDDDDD" },
            };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });
        data.forEach((row) => {
            sheet.addRow({
                date: row.date,
                bookingId: row.bookingId,
                lawyerId: row.lawyerId,
                lawyerName: row.lawyerName,
                clientId: row.clientId,
                type: row.type,
                baseFee: row.baseFee,
                subscriptionDiscount: row.subscriptionDiscount,
                followupDiscount: row.followupDiscount,
                amountPaid: row.amountPaid,
                commissionPercent: row.commissionPercent,
                commissionAmount: row.commissionAmount,
                lawyerAmount: row.lawyerAmount,
                status: row.status,
            });
        });
        sheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1)
                return;
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });
        });
        sheet.addRow([]);
        const summaryTitle = sheet.addRow(["SUMMARY"]);
        summaryTitle.font = { bold: true, size: 13 };
        const s1 = sheet.addRow(["Total Bookings", summary.totalBookings]);
        const s2 = sheet.addRow(["Total Paid", summary.totalPaid]);
        const s3 = sheet.addRow(["Admin Commission", summary.totalCommission]);
        const s4 = sheet.addRow(["Lawyer Share", summary.totalLawyerShare]);
        [s1, s2, s3, s4].forEach((row) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });
        });
        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
    getFileExtension() {
        return "xlsx";
    }
    getMimeType() {
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }
}
exports.XlsReportGenerator = XlsReportGenerator;
