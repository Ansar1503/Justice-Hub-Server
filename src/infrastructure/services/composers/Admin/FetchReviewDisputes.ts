import { DisputesRepo } from "@infrastructure/database/repo/DisputesRepo";
import { FetchReviewDisputes } from "@interfaces/controller/Admin/FetchReviewDisputes";
import { IController } from "@interfaces/controller/Interface/IController";
import { FetchReviewDisputesUseCase } from "@src/application/usecases/Admin/Implementations/FetchReviewDisputesUseCase";

export function FetchReviewDipsutesComposer(): IController {
    const repo = new DisputesRepo();
    const usecase = new FetchReviewDisputesUseCase(repo);
    const controller = new FetchReviewDisputes(usecase);
    return controller;
}
