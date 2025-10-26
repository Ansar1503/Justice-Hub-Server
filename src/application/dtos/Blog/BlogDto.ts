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
