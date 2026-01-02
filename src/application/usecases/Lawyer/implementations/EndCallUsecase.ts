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
    const callStart =
      ongoingLog.client_joined_at && ongoingLog.lawyer_joined_at
        ? Math.max(
            ongoingLog.client_joined_at.getTime(),
            ongoingLog.lawyer_joined_at.getTime()
          )
        : ongoingLog.start_time?.getTime();
    const callDuration = callStart ? newDate.getTime() - callStart : 0;
    await this._callLogsRepo.updateByRoomAndOngoingStatus({
      roomId: input.roomId,
      end_time: newDate,
      status: "completed",
      callDuration: callDuration,
      lawyer_left_at: newDate,
      client_left_at: newDate,
    });
  }
}
