import { PracticeAreaRepo } from "@infrastructure/database/repo/PracticeAreaRepo";
import { PracticeAreaMapper } from "@infrastructure/Mapper/Implementations/PracticeAreaMapper";
import { IController } from "@interfaces/controller/Interface/IController";
import { FindPracticeAreasBySpecIds } from "@interfaces/controller/PracticeArea/FindPracticeAreasBySpecIds";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FindPracticeAreasBySpecIdsUsecase } from "@src/application/usecases/PracitceAreas/Implementation/FindPacticeAreasBySpecIdsUsecase";

export function FindPracticeAreasBySpecIdsComposer(): IController {
    const practiceAreaRepo = new PracticeAreaRepo(new PracticeAreaMapper());
    const usecase = new FindPracticeAreasBySpecIdsUsecase(practiceAreaRepo);
    return new FindPracticeAreasBySpecIds(usecase, new HttpErrors(), new HttpSuccess());
}
