import { IUseCase } from "../IUseCases/IUseCase";

export interface IDeleteCaseDocument
  extends IUseCase<{ documentId: string; userId: string }, void> {}
