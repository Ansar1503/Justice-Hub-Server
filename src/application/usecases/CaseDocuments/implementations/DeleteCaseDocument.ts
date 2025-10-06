import { ICaseDocumentsRepo } from "@domain/IRepository/ICaseDocumentRepo";
import { IDeleteCaseDocument } from "../IDeleteCaseDocument";
import { ICloudinaryService } from "@src/application/services/Interfaces/ICloudinaryService";

export class DeleteCaseDocumentsUseCase implements IDeleteCaseDocument {
  constructor(
    private _caseDocumentsRepo: ICaseDocumentsRepo,
    private _cloudinaryService: ICloudinaryService
  ) {}
  async execute(input: { documentId: string; userId: string }): Promise<void> {
    const existingCaseDocuments = await this._caseDocumentsRepo.findById(
      input.documentId
    );
    if (!existingCaseDocuments) throw new Error("case documents not found");
    if (existingCaseDocuments.uploadedBy !== input.userId)
      throw new Error("Unable to delete others uploaded file");
    await this._caseDocumentsRepo.delete(input.documentId);
    await this._cloudinaryService.deleteFile(
      existingCaseDocuments.document.url
    );
  }
}
