import {
  FetchReviewDisputesInputDto,
  FetchReviewDisputesOutputDto,
} from "@src/application/dtos/Admin/FetchReviewDisputesDto";
import { Disputes } from "../entities/Disputes";
import {
  FetchChatDisputesInputDto,
  FetchChatDisputesOutputDto,
} from "@src/application/dtos/Admin/FetchChatDisputesDto";

export interface IDisputes {
  create(payload: Disputes): Promise<Disputes>;
  findByContentId(payload: { contentId: string }): Promise<Disputes | null>;
  findReviewDisputes(
    payload: FetchReviewDisputesInputDto
  ): Promise<FetchReviewDisputesOutputDto>;
  updateReviewDispute(payload: {
    disputeId: string;
    status: Disputes["status"];
  }): Promise<Disputes | null>;
  findAllChatDisputes(
    payload: FetchChatDisputesInputDto
  ): Promise<FetchChatDisputesOutputDto>;
}
