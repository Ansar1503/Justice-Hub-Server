import { CommissionTransactionRepo } from "@infrastructure/database/repo/CommissionTransactionRepo";
import { CommissionTransactionMapper } from "@infrastructure/Mapper/Implementations/CommissionTransactionMapper";
import { PdfReportGenerator } from "@infrastructure/Providers/PdfReportGenerator";
import { ReportService } from "@infrastructure/Providers/ReportService";
import { XlsReportGenerator } from "@infrastructure/Providers/XlsReportGenerator";
import { DownloadSalesReportController } from "@interfaces/controller/Admin/GenerateSalesReportController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { GenerateSalesReportUsecase } from "@src/application/usecases/Admin/Implementations/GenerateSalesReportUsecase";

export function GenerateSalesReportComposer(): IController {
  const reportService = new ReportService();
  reportService.register("pdf", new PdfReportGenerator());
  reportService.register("xls", new XlsReportGenerator());
  const usecase = new GenerateSalesReportUsecase(
    reportService,
    new CommissionTransactionRepo(new CommissionTransactionMapper())
  );
  return new DownloadSalesReportController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
