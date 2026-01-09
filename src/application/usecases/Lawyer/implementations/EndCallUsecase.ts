import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { IEndCallUsecase } from "../IEndCallUsecase";
import { ISessionsRepo } from "@domain/IRepository/ISessionsRepo";
import { ICallLogs } from "@domain/IRepository/ICallLogs";

export class EndCallUsecase implements IEndCallUsecase {
  constructor(
    private _userRepo: IUserRepository,
    private _sessionRepo: ISessionsRepo,
    private _callLogsRepo: ICallLogs
  ) {}
  async execute(input: { sessionId: string; roomId: string; userId: string }) {
    const user = await this._userRepo.findByuser_id(input.userId);
    const session = await this._sessionRepo.findById({
      session_id: input.sessionId,
    });
    if (!session) throw new Error("session not found");
    const callLogs = await this._callLogsRepo.findByRoomId({
      roomId: input.roomId,
    });
    if (!callLogs) throw new Error("call logs not found");
    const ongoingLog = callLogs.find((log) => log.status === "ongoing");
    if (!ongoingLog) throw new Error("call log not found");
    const newDate = new Date();
    const joinTimes = [
      ongoingLog.client_joined_at,
      ongoingLog.lawyer_joined_at,
    ].filter(Boolean) as Date[];

    const sessionStart = joinTimes.length
      ? Math.min(...joinTimes.map((d) => d.getTime()))
      : ongoingLog.start_time?.getTime();
    const leaveTimes = [
      ongoingLog.client_left_at,
      ongoingLog.lawyer_left_at,
    ].filter(Boolean) as Date[];

    const sessionEnd = leaveTimes.length
      ? Math.max(...leaveTimes.map((d) => d.getTime()))
      : newDate.getTime();

    const callDuration =
      sessionStart && sessionEnd ? sessionEnd - sessionStart : 0;
    await this._callLogsRepo.updateByRoomAndOngoingStatus({
      roomId: input.roomId,
      end_time: newDate,
      status: "completed",
      callDuration,
      lawyer_left_at:
        user?.role === "lawyer" ? newDate : ongoingLog.lawyer_left_at,
      client_left_at:
        user?.role === "client" ? newDate : ongoingLog.client_left_at,
    });
  }
}
