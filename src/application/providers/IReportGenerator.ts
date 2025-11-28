export interface IReportGenerator<TData> {
    generateReport(data: TData): Promise<Buffer>;
    getMimeType(): string;
    getFileExtension(): string;
}