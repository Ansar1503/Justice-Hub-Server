import { Review } from "../entities/Review.entity";
export interface IreviewRepo {
  create(payload: Review): Promise<void>;
  update(payload: Review): Promise<void>;
  fetchAll(): Promise<Review[] | []>;
  delete(id: string): Promise<void>;
}
