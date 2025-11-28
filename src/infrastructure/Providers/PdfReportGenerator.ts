import PDFDocument from "pdfkit";
import { IReportGenerator } from "@src/application/providers/IReportGenerator";
import { SalesReportRow } from "@src/application/dtos/Admin/SalesReportDto";
import { Buffer } from "node:buffer";

export class PdfReportGenerator implements IReportGenerator<SalesReportRow[]> {
  async generateReport(data: SalesReportRow[], summary?: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 10 });
      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);
      doc.fontSize(20).text("Sales Report", { align: "center" });
      doc.moveDown();
      const tableTop = doc.y;
      const rowHeight = 28;
      const colWidths = {
        date: 70,
        bookingId: 75,
        lawyerName: 120,
        lawyerId: 80,
        clientId: 80,
        paid: 50,
        commission: 70,
        lawyerAmount: 70,
      };

      this.drawTableHeader(doc, tableTop, colWidths, rowHeight);
      let y = tableTop + rowHeight;
      data.forEach((row) => {
        const trimmedLawyerId =
          row.lawyerId.length > 12
            ? row.lawyerId.substring(0, 12) + "…"
            : row.lawyerId;
        const trimmedClientId =
          row.clientId.length > 12
            ? row.clientId.substring(0, 12) + "…"
            : row.clientId;
        if (y + rowHeight > doc.page.height - 50) {
          doc.addPage();
          this.drawTableHeader(doc, 40, colWidths, rowHeight);
          y = 40 + rowHeight;
        }

        this.drawRow(
          doc,
          y,
          rowHeight,
          [
            row.date,
            row.bookingId,
            row.lawyerName,
            trimmedLawyerId,
            trimmedClientId,
            `${row.amountPaid}`,
            `${row.commissionAmount}`,
            `${row.lawyerAmount}`,
          ],
          colWidths
        );
        y += rowHeight;
      });
      if (doc.y > doc.page.height - 150) {
        doc.addPage();
      }
      doc.x = 10;
      doc.moveDown(2);

      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Summary", { underline: true });
      doc.moveDown(1);

      doc.fontSize(12).font("Helvetica");
      doc.text(`Total Bookings: ${summary.totalBookings}`);
      doc.text(`Total Collected (Paid): ${summary.totalPaid}`);
      doc.text(`Admin Commission: ${summary.totalCommission}`);
      doc.text(`Lawyer Share: ${summary.totalLawyerShare}`);
      doc.end();
    });
  }

  private drawTableHeader(
    doc: PDFKit.PDFDocument,
    y: number,
    colWidths: any,
    rowHeight: number
  ) {
    doc.fontSize(11).font("Helvetica-Bold");
    const headers = [
      "Date",
      "Booking ID",
      "Lawyer Name",
      "Lawyer ID",
      "Client ID",
      "Paid",
      "Commission",
      "Lawyer Share",
    ];
    let x = 0;
    headers.forEach((header, index) => {
      const width = Object.values(colWidths)[index] as number;
      doc.rect(x, y, width, rowHeight).stroke();
      const textY = y + rowHeight / 2 - 6;
      doc.text(header, x + 5, textY, {
        width: width - 10,
        align: "left",
      });

      x += width;
    });
  }

  private drawRow(
    doc: PDFKit.PDFDocument,
    y: number,
    rowHeight: number,
    rowData: any[],
    colWidths: any
  ) {
    doc.fontSize(10).font("Helvetica");
    let x = 0;
    rowData.forEach((value, index) => {
      const width = Object.values(colWidths)[index] as number;
      doc.rect(x, y, width, rowHeight).stroke();
      const textY = y + rowHeight / 2 - 5;
      doc.text(String(value), x + 5, textY, {
        width: width - 10,
        align: "left",
      });
      x += width;
    });
  }

  getMimeType(): string {
    return "application/pdf";
  }

  getFileExtension(): string {
    return "pdf";
  }
}
