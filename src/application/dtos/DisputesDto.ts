export interface DisputesDto {
  id: string;
  disputeType: "reviews" | "messages";
  contentId: string;
  reportedBy: string;
  reportedUser: string;
  reason: string;
  status: "pending" | "resolved" | "rejected";
  resolveAction?: "deleted" | "blocked";
  createdAt: Date;
  updatedAt: Date;
}
