import { Disputes } from "../entities/Disputes";

export interface IDisputes {
  create(payload: Disputes): Promise<Disputes>;
  findByContentId(payload: { contentId: string }): Promise<Disputes | null>;
  
}
