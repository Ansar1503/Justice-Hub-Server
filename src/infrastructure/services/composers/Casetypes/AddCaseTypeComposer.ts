import { CaseTypeRepo } from "@infrastructure/database/repo/CaseTypeRepo";
import { PracticeAreaRepo } from "@infrastructure/database/repo/PracticeAreaRepo";
import { CaseTypeMapper } from "@infrastructure/Mapper/Implementations/CaseTypeMapper";
import { PracticeAreaMapper } from "@infrastructure/Mapper/Implementations/PracticeAreaMapper";
import { AddCasetypeController } from "@interfaces/controller/CaseType/AddCaseTypeController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { AddCasetypeUsecase } from "@src/application/usecases/CaseType/implementation/AddCasetypeUsecase";

export function AddCaseTypeComposer(): IController {
    const caseTypeRepo = new CaseTypeRepo(new CaseTypeMapper());
    const practiceAreaRepo = new PracticeAreaRepo(new PracticeAreaMapper());
    const usecase = new AddCasetypeUsecase(caseTypeRepo, practiceAreaRepo);
    return new AddCasetypeController(
        usecase,
        new HttpErrors(),
        new HttpSuccess()
    );
}
