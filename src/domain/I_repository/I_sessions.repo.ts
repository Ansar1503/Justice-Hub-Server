import { Session } from "../entities/Session.entity";

export interface ISessionsRepo {
  create(payload: Session): Promise<Session>;
}
