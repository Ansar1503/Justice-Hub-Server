import { Session } from "../../../domain/entities/Session.entity";
import { ISessionsRepo } from "../../../domain/I_repository/I_sessions.repo";
import { SessionModel } from "../model/sessions.model";
export class SessionsRepository implements ISessionsRepo {
  async create(payload: Session): Promise<Session> {
    const newSessions = new SessionModel(payload);
    const savedSession = await newSessions.save();
    return {
      ...savedSession.toObject(),
      _id: savedSession._id?.toString(),
    } as Session;
  }
}
