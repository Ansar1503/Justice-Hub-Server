import ExcelJS from "exceljs";
import { IReportGenerator } from "@src/application/providers/IReportGenerator";
import { SalesReportRow } from "@src/application/dtos/Admin/SalesReportDto";

export class XlsReportGenerator implements IReportGenerator<SalesReportRow[]> {
    async generateReport(data: SalesReportRow[]): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Sales Report");
        sheet.columns = [
            { header: "Date", key: "date", width: 15 },
            { header: "Booking ID", key: "bookingId", width: 20 },
            { header: "Lawyer ID", key: "lawyerId", width: 20 },
            { header: "Lawyer Name", key: "lawyerName", width: 25 },
            { header: "Client ID", key: "clientId", width: 20 },
            { header: "Type", key: "type", width: 12 },
            { header: "Base Fee (₹)", key: "baseFee", width: 15 },
            { header: "Subscription Discount (₹)", key: "subscriptionDiscount", width: 20 },
            { header: "Follow-up Discount (₹)", key: "followupDiscount", width: 20 },
            { header: "Amount Paid (₹)", key: "amountPaid", width: 18 },
            { header: "Commission %", key: "commissionPercent", width: 15 },
            { header: "Admin Commission (₹)", key: "commissionAmount", width: 20 },
            { header: "Lawyer Payout (₹)", key: "lawyerAmount", width: 20 },
            { header: "Status", key: "status", width: 15 }
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
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
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
                status: row.status
            });
        });

        sheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;
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
    getFileExtension(): string {
        return "xlsx";
    }

    getMimeType(): string {
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }
}
