"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartCallUsecase = void 0;
const CallLogs_1 = require("@domain/entities/CallLogs");
class StartCallUsecase {
    _sessionRepo;
    _callLogsRepo;
    _userRepo;
    constructor(_sessionRepo, _callLogsRepo, _userRepo) {
        this._sessionRepo = _sessionRepo;
        this._callLogsRepo = _callLogsRepo;
        this._userRepo = _userRepo;
    }
    async execute(input) {
        const user = await this._userRepo.findByuser_id(input.userId);
        const session = await this._sessionRepo.findById({
            session_id: input.sessionId,
        });
        if (!session)
            throw new Error("session not found");
        const CallsByRoomId = await this._callLogsRepo.findByRoomId({
            roomId: input.roomId,
        });
        const existingCall = CallsByRoomId.find((call) => call.status === "ongoing");
        const newDate = new Date();
        if (!existingCall) {
            const newCall = CallLogs_1.CallLogs.create({
                roomId: input.roomId,
                session_id: input.sessionId,
                status: "ongoing",
                callDuration: 0,
                start_time: newDate,
                client_joined_at: user?.role === "client" ? newDate : undefined,
                lawyer_joined_at: user?.role === "lawyer" ? newDate : undefined,
            });
            await this._callLogsRepo.create(newCall);
        }
        else {
            if (user?.role === "client" && !existingCall.client_joined_at) {
                await this._callLogsRepo.updateByRoomAndOngoingStatus({
                    roomId: input.roomId,
                    client_joined_at: newDate,
                });
            }
            else if (user?.role === "lawyer" && !existingCall.lawyer_joined_at) {
                await this._callLogsRepo.updateByRoomAndOngoingStatus({
                    roomId: input.roomId,
                    lawyer_joined_at: newDate,
                });
            }
        }
    }
}
exports.StartCallUsecase = StartCallUsecase;
