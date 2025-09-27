import { CaseTypeRepo } from "@infrastructure/database/repo/CaseTypeRepo";
import { CaseTypeMapper } from "@infrastructure/Mapper/Implementations/CaseTypeMapper";
import { FindAllCaseTypes } from "@interfaces/controller/CaseType/FindAllCasetypes";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FindAllCaseTypesUseCase } from "@src/application/usecases/CaseType/implementation/FindAllCaseTypes";

export function FindAllCaseTypesComposer(): IController {
    const usecase = new FindAllCaseTypesUseCase(new CaseTypeRepo(new CaseTypeMapper()));
    return new FindAllCaseTypes(usecase, new HttpErrors(), new HttpSuccess());
}
