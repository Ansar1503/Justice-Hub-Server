export interface BlogComment {
  userId: string;
  comment: string;
  createdAt: Date;
}

export interface BaseBlogDto {
  id: string;
  lawyerId: string;
  title: string;
  content: string;
  coverImage?: string;
  isPublished: boolean;
  likes: string[];
  comments: BlogComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBlogDto {
  lawyerId: string;
  title: string;
  content: string;
  coverImage?: string;
  isPublished?: boolean;
}

export interface UpdateBlogDto {
  blogId: string;
  title: string;
  content: string;
  coverImage?: string;
  isPublished?: boolean;
}

export type FetchBlogsByLawyerQueryDto = {
  lawyerId: string;
  page: number;
  limit: number;
  search: string;
  filter: "all" | "published" | "draft";
  sort: "newest" | "oldest" | "title-asc" | "title-desc" | "likes" | "comments";
};

export type FetchBlogsByLawyerResponseDto = {
  totalCount: number;
  currentPage: number;
  totalPage: number;
  data: BaseBlogDto[];
};

type sortByType = "newest" | "most-liked" | "most-commented";

export type FetchBlogsByClientType = {
  cursor?: number;
  search: string;
  sortBy: sortByType;
};

type UserSummary = {
  userId: string;
  name: string;
  profile_image: string;
};

type LawyerSummary = {
  name: string;
  profile_image: string;
};

type BlogCommentWithUser = {
  userId: string;
  name: string;
  profile_image: string;
  comment: string;
  createdAt: Date | string;
};

export type FetchedBlogByClient = {
  id: string;
  title: string;
  content: string;
  coverImage?: string;
  isPublished: boolean;
  lawyerDetails: LawyerSummary;
  likes: UserSummary[];
  comments: BlogCommentWithUser[];
  createdAt: Date;
  updatedAt: Date;
};

export type infiniteFetchBlogsByClient = {
  data: FetchedBlogByClient[];
  nextCursor?: number;
};
