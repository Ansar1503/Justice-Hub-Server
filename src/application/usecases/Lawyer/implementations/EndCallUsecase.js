"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndCallUsecase = void 0;
class EndCallUsecase {
    _userRepo;
    _sessionRepo;
    _callLogsRepo;
    constructor(_userRepo, _sessionRepo, _callLogsRepo) {
        this._userRepo = _userRepo;
        this._sessionRepo = _sessionRepo;
        this._callLogsRepo = _callLogsRepo;
    }
    async execute(input) {
        const user = await this._userRepo.findByuser_id(input.userId);
        const session = await this._sessionRepo.findById({
            session_id: input.sessionId,
        });
        if (!session)
            throw new Error("session not found");
        const callLogs = await this._callLogsRepo.findByRoomId({
            roomId: input.roomId,
        });
        if (!callLogs)
            throw new Error("call logs not found");
        const ongoingLog = callLogs.find((log) => log.status === "ongoing");
        if (!ongoingLog)
            throw new Error("call log not found");
        const newDate = new Date();
        const callStart = ongoingLog.client_joined_at && ongoingLog.lawyer_joined_at
            ? Math.max(ongoingLog.client_joined_at.getTime(), ongoingLog.lawyer_joined_at.getTime())
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
exports.EndCallUsecase = EndCallUsecase;
