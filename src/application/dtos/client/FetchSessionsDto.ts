export interface FetchSessionsInputDto {
    user_id: string;
    search: string;
    sort: "name" | "date" | "amount" | "created_at";
    order: "asc" | "desc";
    status?: "upcoming" | "ongoing" | "completed" | "cancelled" | "missed";
    consultation_type?: "consultation" | "follow-up";
    page: number;
    limit: number;
}

export interface FetchSessionOutputDto {
    data: any;
    totalCount: number;
    currentPage: number;
    totalPage: number;
}
