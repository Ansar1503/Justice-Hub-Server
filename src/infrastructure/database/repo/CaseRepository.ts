import { ICaseRepo } from "@domain/IRepository/ICaseRepo";
import { BaseRepository } from "./base/BaseRepo";
import { Case } from "@domain/entities/Case";
import { CaseModel, ICaseModel } from "../model/CaseModel";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import { ClientSession } from "mongoose";

export class CaseRepository
  extends BaseRepository<Case, ICaseModel>
  implements ICaseRepo
{
  constructor(mapper: IMapper<Case, ICaseModel>, session?: ClientSession) {
    super(CaseModel, mapper, session);
  }
}
