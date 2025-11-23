import { CaseRepository } from "@infrastructure/database/repo/CaseRepository";
import { CaseMapper } from "@infrastructure/Mapper/Implementations/CaseMapper";
import { UpdateCaseDetailsController } from "@interfaces/controller/Cases/UpdateCasesDetailsController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { UpdateCaseDetailsUsecase } from "@src/application/usecases/Case/Implimentations/UpdateCaseDetailsUsecase";

export function updateCaseDetailsComposer(): IController {
    const usecase = new UpdateCaseDetailsUsecase(new CaseRepository(new CaseMapper()))
    return new UpdateCaseDetailsController(usecase, new HttpErrors(), new HttpSuccess())
}