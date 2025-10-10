import {
  FetchReviewDisputesInputDto,
  FetchReviewDisputesOutputDto,
} from "@src/application/dtos/Admin/FetchReviewDisputesDto";
import {
  FetchChatDisputesInputDto,
  FetchChatDisputesOutputDto,
} from "@src/application/dtos/Admin/FetchChatDisputesDto";
import { Disputes } from "../entities/Disputes";
import { DisputeDto } from "@src/application/dtos/client/DashboardDto";

export interface IDisputes {
  create(payload: Disputes): Promise<Disputes>;
  findById(id: string): Promise<Disputes | null>;
  findByContentId(payload: { contentId: string }): Promise<Disputes | null>;
  findReviewDisputes(
    payload: FetchReviewDisputesInputDto
  ): Promise<FetchReviewDisputesOutputDto>;
  findAllChatDisputes(
    payload: FetchChatDisputesInputDto
  ): Promise<FetchChatDisputesOutputDto>;
  update(payload: {
    disputesId: string;
    action?: "blocked" | "deleted";
    status: "pending" | "resolved" | "rejected";
  }): Promise<Disputes | null>;
  getRecentDisputes(limit: number): Promise<DisputeDto[]>;
  countOpen(): Promise<number>;
}
