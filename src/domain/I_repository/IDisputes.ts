import { Client } from "../entities/Client.entity";
import { Disputes } from "../entities/Disputes";
import { Review } from "../entities/Review.entity";

export interface IDisputes {
  create(payload: Disputes): Promise<Disputes>;
  findByContentId(payload: { contentId: string }): Promise<Disputes | null>;
  findReviewDisputes(payload: {
    limit: number;
    page: number;
    search: string;
    sortBy: "review_date" | "reported_date" | "All";
    sortOrder: "asc" | "desc";
  }): Promise<{
    data:
      | ({
          contentData: Review;
          reportedByuserData: Client;
          reportedUserData: Client;
        } & Disputes)[]
      | [];
    totalCount: number;
    currentPage: number;
    totalPage: number;
  }>;
  updateReviewDispute(payload: {
    disputeId: string;
    status: Disputes["status"];
  }): Promise<Disputes | null>;
}
