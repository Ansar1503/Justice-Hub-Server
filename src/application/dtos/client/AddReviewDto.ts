export interface AddReviewInputDto {
    session_id: string;
    heading: string;
    review: string;
    rating: number;
    client_id: string;
    lawyer_id: string;
}
