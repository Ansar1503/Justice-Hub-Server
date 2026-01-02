"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallLogsRepository = void 0;
const CallLogsMapper_1 = require("@infrastructure/Mapper/Implementations/CallLogsMapper");
const CallLogsModel_1 = require("../model/CallLogsModel");
class CallLogsRepository {
    mapper;
    _session;
    constructor(mapper = new CallLogsMapper_1.CallLogsMapper(), _session) {
        this.mapper = mapper;
        this._session = _session;
    }
    async create(payload) {
        const newLog = new CallLogsModel_1.CallLogsModel(this.mapper.toPersistence(payload));
        await newLog.save({ session: this._session });
        return this.mapper.toDomain(newLog);
    }
    async findBySessionId(payload) {
        const { limit, page, sessionId } = payload;
        const skip = (page - 1) * limit;
        const data = await CallLogsModel_1.CallLogsModel.find({
            session_id: sessionId,
            status: { $ne: "ongoing" },
        })
            .limit(limit)
            .skip(skip)
            .lean();
        const totalCount = await CallLogsModel_1.CallLogsModel.countDocuments({
            session_id: sessionId,
        });
        const totalPages = Math.ceil(totalCount / limit);
        const currentPage = page;
        return {
            data: data && this.mapper.toDomainArray
                ? this.mapper.toDomainArray(data)
                : [],
            totalCount,
            currentPage,
            totalPages,
        };
    }
    async updateByRoomId(payload) {
        const { roomId, callDuration, client_joined_at, client_left_at, end_time, lawyer_joined_at, lawyer_left_at, start_time, session_id, status, } = payload;
        if (!roomId)
            return null;
        const update = {};
        if (callDuration) {
            update.callDuration = callDuration;
        }
        if (client_joined_at) {
            update.client_joined_at = client_joined_at;
        }
        if (client_left_at) {
            update.client_left_at = client_left_at;
        }
        if (end_time) {
            update.end_time = end_time;
        }
        if (lawyer_joined_at) {
            update.lawyer_joined_at = lawyer_joined_at;
        }
        if (lawyer_left_at) {
            update.lawyer_left_at = lawyer_left_at;
        }
        if (start_time) {
            update.start_time = start_time;
        }
        if (end_time) {
            update.end_time = end_time;
        }
        if (session_id) {
            update.session_id = session_id;
        }
        if (status) {
            update.status = status;
        }
        const updatedLog = await CallLogsModel_1.CallLogsModel.findOneAndUpdate({ roomId: roomId }, { $set: update }, { new: true });
        // console.log("updatedLogs:", updatedLog);
        if (!updatedLog)
            return null;
        return this.mapper.toDomain(updatedLog);
    }
    async findByRoomId(payload) {
        const { roomId } = payload;
        const log = await CallLogsModel_1.CallLogsModel.find({
            roomId: roomId,
        });
        if (!log)
            return [];
        return this.mapper.toDomainArray ? this.mapper.toDomainArray(log) : [];
    }
    async updateByRoomAndOngoingStatus(payload) {
        const { roomId, callDuration, client_joined_at, client_left_at, end_time, lawyer_joined_at, lawyer_left_at, start_time, session_id, status, } = payload;
        if (!roomId)
            return null;
        const update = {};
        if (callDuration) {
            update.callDuration = callDuration;
        }
        if (client_joined_at) {
            update.client_joined_at = client_joined_at;
        }
        if (client_left_at) {
            update.client_left_at = client_left_at;
        }
        if (end_time) {
            update.end_time = end_time;
        }
        if (lawyer_joined_at) {
            update.lawyer_joined_at = lawyer_joined_at;
        }
        if (lawyer_left_at) {
            update.lawyer_left_at = lawyer_left_at;
        }
        if (start_time) {
            update.start_time = start_time;
        }
        if (end_time) {
            update.end_time = end_time;
        }
        if (session_id) {
            update.session_id = session_id;
        }
        if (status) {
            update.status = status;
        }
        const updatedLog = await CallLogsModel_1.CallLogsModel.findOneAndUpdate({ roomId: roomId, status: "ongoing" }, { $set: update }, { new: true });
        // console.log("updatedLogs:", updatedLog);
        if (!updatedLog)
            return null;
        return this.mapper.toDomain(updatedLog);
    }
}
exports.CallLogsRepository = CallLogsRepository;
