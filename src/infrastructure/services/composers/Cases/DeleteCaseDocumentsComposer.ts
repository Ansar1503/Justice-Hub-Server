import { CaseDocumentRepo } from "@infrastructure/database/repo/CaseDocumentRepo";
import { caseDocumentsMapper } from "@infrastructure/Mapper/Implementations/CaseDocumentsMapper";
import { DeleteCaseDocumentsController } from "@interfaces/controller/Cases/DeleteCaseDocumentController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { CloudinaryService } from "@src/application/services/cloudinary.service";
import { DeleteCaseDocumentsUseCase } from "@src/application/usecases/CaseDocuments/implementations/DeleteCaseDocument";

export function DeleteCaseDocumentComposer(): IController {
  const usecase = new DeleteCaseDocumentsUseCase(
    new CaseDocumentRepo(new caseDocumentsMapper()),
    new CloudinaryService()
  );
  return new DeleteCaseDocumentsController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
