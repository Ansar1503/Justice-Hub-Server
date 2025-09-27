import { IController } from "@interfaces/controller/Interface/IController";
import { FetchLawyerController } from "@interfaces/controller/Lawyer/FetchLawyerController";
import { FetchLawyerDataUseCase } from "@src/application/usecases/Lawyer/implementations/FetchLawyerDataUseCase";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { LawyerRepository } from "@infrastructure/database/repo/LawyerRepo";
import { LawyerDocumentsRepository } from "@infrastructure/database/repo/LawyerDocuemtsRepo";
import { LawyerVerificationRepo } from "@infrastructure/database/repo/LawyerVerificationRepo";
import { LawyerVerificationMapper } from "@infrastructure/Mapper/Implementations/LawyerVerificaitionMapper";

export function FetchLawyerComposer(): IController {
    const userRepo = new UserRepository();
    const lawyerRepo = new LawyerRepository();
    const lawyerDocsRepo = new LawyerDocumentsRepository();
    const lawyerVerificationRepo = new LawyerVerificationRepo(new LawyerVerificationMapper());
    const usecase = new FetchLawyerDataUseCase(userRepo, lawyerRepo, lawyerDocsRepo, lawyerVerificationRepo);
    return new FetchLawyerController(usecase);
}
