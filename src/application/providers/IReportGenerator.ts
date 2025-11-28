export interface IReportGenerator<TData> {
  generateReport(data: TData, summary?: any): Promise<Buffer>;
  getMimeType(): string;
  getFileExtension(): string;
}
