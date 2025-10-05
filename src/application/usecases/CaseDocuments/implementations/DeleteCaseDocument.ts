import { ICaseDocumentsRepo } from "@domain/IRepository/ICaseDocumentRepo";
import { IDeleteCaseDocument } from "../IDeleteCaseDocument";
import { ICloudinaryService } from "@src/application/services/Interfaces/ICloudinaryService";

export class DeleteCaseDocumentsUseCase implements IDeleteCaseDocument {
  constructor(
    private _caseDocumentsRepo: ICaseDocumentsRepo,
    private _cloudinaryService: ICloudinaryService
  ) {}
  async execute(input: string): Promise<void> {
    const existingCaseDocuments = await this._caseDocumentsRepo.findById(input);
    if (!existingCaseDocuments) throw new Error("case documents not found");
    await this._caseDocumentsRepo.delete(input);
    await this._cloudinaryService.deleteFile(
      existingCaseDocuments.document.url
    );
  }
}
