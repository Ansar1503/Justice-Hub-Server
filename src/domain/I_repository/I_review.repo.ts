import { Review } from "../entities/Review.entity";
export interface IreviewRepo {
  create(payload: Review): Promise<Review>;
  update(payload: Partial<Review>): Promise<Review>;
  findByLawyer_id(payload: {
    lawyer_id: string;
    page: number;
  }): Promise<{ data: Review[]; nextCursor?: number }>;
  findBySession_id(
    session_id: string
  ): Promise<
    (Review & { reviewedBy: { name: string; profile_image: string } })[] | []
  >;
  delete(id: string): Promise<Review>;
}
