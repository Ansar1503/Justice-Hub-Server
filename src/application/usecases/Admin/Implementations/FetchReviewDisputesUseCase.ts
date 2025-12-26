import { IDisputes } from "@domain/IRepository/IDisputesRepo";
import {
    FetchReviewDisputesInputDto,
    FetchReviewDisputesOutputDto,
} from "@src/application/dtos/Admin/FetchReviewDisputesDto";
import { IFetchReviewDisputesUseCase } from "../IFetchReviewDisputesUseCase";

export class FetchReviewDisputesUseCase implements IFetchReviewDisputesUseCase {
    constructor(private _DisputesRepo: IDisputes) {}
    async execute(input: FetchReviewDisputesInputDto): Promise<FetchReviewDisputesOutputDto> {
        const disputes = await this._DisputesRepo.findReviewDisputes(input);
        return disputes;
    }
}
