import { IReportGenerator } from "@src/application/providers/IReportGenerator";
import { SalesReportRow } from "@src/application/dtos/Admin/SalesReportDto";

export class ReportService {
    private generators: Map<string, IReportGenerator<SalesReportRow[]>>;
    constructor() {
        this.generators = new Map();
    }
    register(format: string, generator: IReportGenerator<SalesReportRow[]>) {
        this.generators.set(format.toLowerCase(), generator);
    }
    get(format: string): IReportGenerator<SalesReportRow[]> {
        const generator = this.generators.get(format.toLowerCase());
        if (!generator) {
            throw new Error(`Unsupported report format: ${format}`);
        }
        return generator;
    }
    has(format: string): boolean {
        return this.generators.has(format.toLowerCase());
    }
}
