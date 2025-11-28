import { IUseCase } from "../IUseCases/IUseCase";

export interface IGenerateSalesReport
  extends IUseCase<
    { startDate: string; endDate: string; format: string },
    {
      buffer: Buffer;
      mimeType: string;
      fileExtension: string;
      filename: string;
    }
  > {}
