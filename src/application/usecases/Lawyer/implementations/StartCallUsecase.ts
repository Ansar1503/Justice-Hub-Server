import { ICallLogs } from "@domain/IRepository/ICallLogs";
import { IStartCallUsecase } from "../IStartCallUsecase";
import { ISessionsRepo } from "@domain/IRepository/ISessionsRepo";
import { CallLogs } from "@domain/entities/CallLogs";
import { IUserRepository } from "@domain/IRepository/IUserRepo";

export class StartCallUsecase implements IStartCallUsecase {
  constructor(
    private _sessionRepo: ISessionsRepo,
    private _callLogsRepo: ICallLogs,
    private _userRepo: IUserRepository
  ) {}
  async execute(input: {
    sessionId: string;
    roomId: string;
    userId: string;
  }): Promise<void> {
    const user = await this._userRepo.findByuser_id(input.userId);
    const session = await this._sessionRepo.findById({
      session_id: input.sessionId,
    });
    if (!session) throw new Error("session not found");
    const CallsByRoomId = await this._callLogsRepo.findByRoomId({
      roomId: input.roomId,
    });
    const existingCall = CallsByRoomId.find(
      (call) =>
        call.status === "ongoing" &&
        ((user?.role === "client" && call.client_joined_at) ||
          (user?.role === "lawyer" && call.lawyer_joined_at))
    );
    const newDate = new Date();
    if (!existingCall) {
      const newCall = CallLogs.create({
        roomId: input.roomId,
        session_id: input.sessionId,
        status: "ongoing",
        callDuration: 0,
        start_time: newDate,
        client_joined_at: user?.role === "client" ? newDate : undefined,
        lawyer_joined_at: user?.role === "lawyer" ? newDate : undefined,
      });
      await this._callLogsRepo.create(newCall);
    } else {
      if (user?.role === "client" && !existingCall.client_joined_at) {
        await this._callLogsRepo.updateByRoomId({
          roomId: input.roomId,
          client_joined_at: newDate,
        });
      } else if (user?.role === "lawyer" && !existingCall.lawyer_joined_at) {
        await this._callLogsRepo.updateByRoomId({
            roomId:input.roomId,
            lawyer_joined_at:newDate
        })
      }
    }
  }
}
