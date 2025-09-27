export interface FetchReviewInputDto {
    user_id: string;
    role: "lawyer" | "client" | "admin";
    search: string;
    page: number;
    limit: number;
    sortBy: "date" | "rating";
    sortOrder: "asc" | "desc";
}

export interface FetchReviewOutputDto {
    data: {
        id: string;
        session_id: string;
        heading: string;
        rating: number;
        review: string;
        active: boolean;
        client_id: string;
        lawyer_id: string;
        reviewedBy: { name: string; profile_image: string };
        reviewedFor: { name: string; profile_image: string };
        createdAt: string;
        updatedAt: string;
    }[];
    totalCount: number;
    currentPage: number;
    totalPage: number;
}
