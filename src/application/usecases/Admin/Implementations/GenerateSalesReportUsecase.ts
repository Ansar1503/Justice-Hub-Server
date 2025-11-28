import { ReportService } from "@infrastructure/Providers/ReportService";
import { IGenerateSalesReport } from "../IGenerateSalesReport";
import { ICommissionTransactionRepo } from "@domain/IRepository/ICommissionTransactionRepo";
import { SalesReportRow } from "@src/application/dtos/Admin/SalesReportDto";

export class GenerateSalesReportUsecase implements IGenerateSalesReport {
  constructor(
    private readonly _reportService: ReportService,
    private readonly _commissionRepo: ICommissionTransactionRepo
  ) {}
  async execute(input: {
    startDate: string;
    endDate: string;
    format: string;
  }): Promise<{
    buffer: Buffer;
    mimeType: string;
    fileExtension: string;
    filename: string;
  }> {
    const { startDate, endDate, format } = input;
    const transactions = await this._commissionRepo.getSalesReport(
      startDate,
      endDate
    );
    if (!transactions || transactions.length === 0) {
      throw new Error("No sales transactions found for the selected period.");
    }
    const rows: SalesReportRow[] = transactions.map((t) => ({
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
    const generator = this._reportService.get(format);
    const buffer = await generator.generateReport(rows);
    return {
      buffer,
      mimeType: generator.getMimeType(),
      fileExtension: generator.getFileExtension(),
      filename: `sales-report-${startDate}-to-${endDate}.${generator.getFileExtension()}`,
    };
  }
}
