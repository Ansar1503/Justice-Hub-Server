import { ICaseDocumentsRepo } from "@domain/IRepository/ICaseDocumentRepo";
import { BaseRepository } from "./base/BaseRepo";
import { CaseDocument } from "@domain/entities/SessionDocument";
import CaseDocumentModel, {
  ICaseDocumentModel,
} from "../model/CaseDocumentModel";
import { IMapper } from "@infrastructure/Mapper/IMapper";

export class CaseDocumentRepo
  extends BaseRepository<CaseDocument, ICaseDocumentModel>
  implements ICaseDocumentsRepo
{
  constructor(mapper: IMapper<CaseDocument, ICaseDocumentModel>) {
    super(CaseDocumentModel, mapper);
  }
}
