import { CaseTypeRepo } from "@infrastructure/database/repo/CaseTypeRepo";
import { CaseTypeMapper } from "@infrastructure/Mapper/Implementations/CaseTypeMapper";
import { DeleteCaseTypeController } from "@interfaces/controller/CaseType/DeleteCasetypeController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { DeleteCasetypeUsecase } from "@src/application/usecases/CaseType/implementation/DeleteCasetypeUsecase";

export function DeleteCasetypeComposer(): IController {
    const casetypeRepo = new CaseTypeRepo(new CaseTypeMapper());
    const usecase = new DeleteCasetypeUsecase(casetypeRepo);
    return new DeleteCaseTypeController(
        usecase,
        new HttpErrors(),
        new HttpSuccess()
    );
}
