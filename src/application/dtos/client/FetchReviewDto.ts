export interface FetchReviewInputDto {
    lawyer_id: string;
    page: number;
}

export interface FetchReviewsOutputDto {
    data: {
        id: string;
        reviewedBy: {
            name: string;
            email: string;
            phone: string;
            profile_image: string;
        };
        session_id: string;
        heading: string;
        review: string;
        rating: number;
        active: boolean;
        client_id: string;
        lawyer_id: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
    nextCursor?: number;
}

interface reviewedBy {
    name: string;
    profile_image: string;
}

export interface FetchReviewsBySessionOutputDto {
    id: string;
    session_id: string;
    heading: string;
    review: string;
    rating: number;
    active: boolean;
    client_id: string;
    lawyer_id: string;
    reviewedBy: reviewedBy;
    createdAt: Date;
    updatedAt: Date;
}
