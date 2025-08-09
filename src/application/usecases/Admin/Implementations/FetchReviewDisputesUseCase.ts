import { IDisputes } from "@domain/IRepository/IDisputesRepo";
import { IFetchReviewDisputesUseCase } from "../IFetchReviewDisputesUseCase";
import {
  FetchReviewDisputesInputDto,
  FetchReviewDisputesOutputDto,
} from "@src/application/dtos/Admin/FetchReviewDisputesDto";

export class FetchReviewDisputesUseCase implements IFetchReviewDisputesUseCase {
  constructor(private DisputesRepo: IDisputes) {}
  async execute(
    input: FetchReviewDisputesInputDto
  ): Promise<FetchReviewDisputesOutputDto> {
    const disputes = await this.DisputesRepo.findReviewDisputes(input);
    return disputes
  }
}
