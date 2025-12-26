import { IReportGenerator } from "@src/application/providers/IReportGenerator";
import { SalesReportRow } from "@src/application/dtos/Admin/SalesReportDto";

export class ReportService {
    private _generators: Map<string, IReportGenerator<SalesReportRow[]>>;
    constructor() {
        this._generators = new Map();
    }
    register(format: string, generator: IReportGenerator<SalesReportRow[]>) {
        this._generators.set(format.toLowerCase(), generator);
    }
    get(format: string): IReportGenerator<SalesReportRow[]> {
        const generator = this._generators.get(format.toLowerCase());
        if (!generator) {
            throw new Error(`Unsupported report format: ${format}`);
        }
        return generator;
    }
    has(format: string): boolean {
        return this._generators.has(format.toLowerCase());
    }
}
