export interface Disputes {
  disputeType: "reviews" | "messages";
  contentId: string;
  reportedBy: string;
  reportedUser: string;
  reason: string;
  status: "pending" | "resolved" | "rejected";
}
