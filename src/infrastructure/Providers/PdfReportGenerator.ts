import PDFDocument from "pdfkit";
import { IReportGenerator } from "@src/application/providers/IReportGenerator";
import { SalesReportRow } from "@src/application/dtos/Admin/SalesReportDto";
import { Buffer } from "node:buffer";

export class PdfReportGenerator implements IReportGenerator<SalesReportRow[]> {
    async generateReport(data: SalesReportRow[]): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 40 });
            const chunks: Buffer[] = [];

            doc.on("data", (chunk) => chunks.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);

            doc.fontSize(20).text("Sales Report", { align: "center" });
            doc.moveDown();

            doc.fontSize(12);
            data.forEach((row) => {
                doc.text(
                    `Date: ${row.date} | Booking: ${row.bookingId}`
                );
                doc.text(
                    `Lawyer: ${row.lawyerName} (${row.lawyerId}) | Client: ${row.clientId}`
                );
                doc.text(
                    `Amount Paid: ₹${row.amountPaid} | Commission: ₹${row.commissionAmount} | Lawyer: ₹${row.lawyerAmount}`
                );
                doc.text(`Status: ${row.status}`);
                doc.moveDown();
            });

            doc.end();
        });
    }

    getMimeType(): string {
        return "application/pdf";
    }

    getFileExtension(): string {
        return "pdf";
    }
}
