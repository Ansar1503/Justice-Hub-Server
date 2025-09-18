import { Case } from "@domain/entities/Case";
import { IBaseRepository } from "./IBaseRepo";

export interface ICaseRepo extends IBaseRepository<Case> {}
