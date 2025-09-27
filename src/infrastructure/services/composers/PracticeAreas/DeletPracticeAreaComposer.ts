import { PracticeAreaRepo } from "@infrastructure/database/repo/PracticeAreaRepo";
import { PracticeAreaMapper } from "@infrastructure/Mapper/Implementations/PracticeAreaMapper";
import { IController } from "@interfaces/controller/Interface/IController";
import { DeletePracticeAreaController } from "@interfaces/controller/PracticeArea/DeletePracticeAreaController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { DeletePracticeAreaUsecase } from "@src/application/usecases/PracitceAreas/Implementation/DeletePracticeAreaUsecase";

export function DeletePracticeAreaComposer(): IController {
    const usecase = new DeletePracticeAreaUsecase(new PracticeAreaRepo(new PracticeAreaMapper()));
    return new DeletePracticeAreaController(usecase, new HttpSuccess(), new HttpErrors());
}
