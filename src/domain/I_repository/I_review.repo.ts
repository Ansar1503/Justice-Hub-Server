import { Review } from "../entities/Review.entity";
export interface IreviewRepo {
  create(payload: Review): Promise<Review>;
  update(payload: Partial<Review>): Promise<Review>;
  findByLawyer_id(lawyer_id: string): Promise<Review[] | []>;
  findBySession_id(session_id: string): Promise<Review | null>;
  delete(id: string): Promise<Review>;
}
