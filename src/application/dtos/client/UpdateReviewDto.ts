export interface UpdateReviewInputDto {
    review_id: string;
    updates: {
        session_id: string;
        heading: string;
        review: string;
        rating: number;
        client_id: string;
        lawyer_id: string;
    };
}

export interface UpdateReviewOutputDto {
    id: string;
    session_id: string;
    heading: string;
    review: string;
    rating: number;
    active: boolean;
    client_id: string;
    lawyer_id: string;
    createdAt: Date;
    updatedAt: Date;
}
