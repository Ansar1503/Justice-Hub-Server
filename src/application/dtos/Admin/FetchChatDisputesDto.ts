import { ChatMessageOutputDto } from "../chats/ChatMessageDto";
import { DisputesDto } from "../DisputesDto";

export interface FetchChatDisputesInputDto {
  search: string;
  page: number;
  limit: number;
  sortBy: "message_date" | "reported_date";
  sortOrder: "asc" | "desc";
}

interface UserProfile {
  user_id: string;
  name: string;
  email: string;
  mobile: string;
  profile_image: string;
}

type ChatDisputesData = Omit<
  DisputesDto,
  "contentId" | "reportedBy" | "reportedUser"
> & {
  reportedBy: UserProfile;
  reportedUser: UserProfile;
  chatMessage: Omit<ChatMessageOutputDto, "senderId" | "receiverId">;
};

export interface FetchChatDisputesOutputDto {
  data: ChatDisputesData[] | [];
  totalCount: number;
  currentPage: number;
  totalPage: number;
}
