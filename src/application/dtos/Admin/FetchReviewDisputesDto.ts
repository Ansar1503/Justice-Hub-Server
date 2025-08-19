export interface FetchReviewDisputesInputDto {
  limit: number;
  page: number;
  search: string;
  sortBy: "review_date" | "reported_date" | "All";
  sortOrder: "asc" | "desc";
}

interface Review {
  session_id: string;
  heading: string;
  review: string;
  active: boolean;
  rating: number;
  client_id: string;
  lawyer_id: string;
}

interface Disputes {
  disputeType: "reviews" | "messages";
  contentId: string;
  reportedBy: string;
  reportedUser: string;
  reason: string;
  status: "pending" | "resolved" | "rejected";
}

interface UserProfile {
  name: string;
  email: string;
  mobile: string;
  user_id: string;
  profile_image: string;
  dob: string;
  gender: string;
}

export interface FetchReviewDisputesOutputDto {
  data:
    | ({
        contentData: Review;
        reportedByuserData: UserProfile;
        reportedUserData: UserProfile;
      } & Disputes)[]
    | [];
  totalCount: number;
  currentPage: number;
  totalPage: number;
}
