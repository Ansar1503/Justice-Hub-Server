import { ICaseRepo } from "@domain/IRepository/ICaseRepo";
import { BaseRepository } from "./base/BaseRepo";
import { Case } from "@domain/entities/Case";
import { ICaseModel } from "../model/CaseModel";

export class CaseRepository
  extends BaseRepository<Case, ICaseModel>
  implements ICaseRepo {}
