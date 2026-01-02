"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsRepository = void 0;
const SessionMapper_1 = require("@infrastructure/Mapper/Implementations/SessionMapper");
const SessionModel_1 = __importDefault(require("../model/SessionModel"));
class SessionsRepository {
    mapper;
    clientSession;
    constructor(mapper = new SessionMapper_1.SessionMapper(), clientSession) {
        this.mapper = mapper;
        this.clientSession = clientSession;
    }
    async aggregate(payload) {
        const { page = 1, limit = 10, search = "", sort = "name", order = "asc", consultation_type, status, user_id, role, } = payload;
        const matchStage = {};
        if (role === "client") {
            matchStage["client_id"] = user_id;
        }
        else if (role === "lawyer") {
            matchStage["lawyer_id"] = user_id;
        }
        const sortStage = {};
        if (sort === "name") {
            sortStage["userData.name"] = order === "asc" ? 1 : -1;
        }
        else if (sort === "amount") {
            sortStage["amount"] = order === "asc" ? 1 : -1;
        }
        else if (sort === "date") {
            sortStage["scheduled_date"] = order === "asc" ? 1 : -1;
        }
        else {
            sortStage["created_at"] = order === "asc" ? 1 : -1;
        }
        if (status &&
            ["upcoming", "ongoing", "completed", "cancelled", "missed"].includes(status)) {
            matchStage["status"] = status;
        }
        if (consultation_type &&
            ["consultation", "follow-up"].includes(consultation_type)) {
            matchStage["type"] = consultation_type;
        }
        const countPipeline = [{ $match: matchStage }];
        const dataPipeline = [{ $match: matchStage }];
        if (role === "lawyer") {
            const lawyerlookups = [
                {
                    $lookup: {
                        from: "users",
                        localField: "client_id",
                        foreignField: "user_id",
                        as: "userData",
                    },
                },
                {
                    $lookup: {
                        from: "clients",
                        localField: "client_id",
                        foreignField: "user_id",
                        as: "clientData",
                    },
                },
                {
                    $addFields: {
                        userData: { $arrayElemAt: ["$userData", 0] },
                        clientData: { $arrayElemAt: ["$clientData", 0] },
                    },
                },
            ];
            dataPipeline.push(...lawyerlookups);
            countPipeline.push(...lawyerlookups);
        }
        if (role === "client") {
            const clientlookups = [
                {
                    $lookup: {
                        from: "users",
                        localField: "lawyer_id",
                        foreignField: "user_id",
                        as: "userData",
                    },
                },
                {
                    $lookup: {
                        from: "clients",
                        localField: "lawyer_id",
                        foreignField: "user_id",
                        as: "clientData",
                    },
                },
                {
                    $lookup: {
                        from: "lawyers",
                        localField: "client_id",
                        foreignField: "user_id",
                        as: "lawyerData",
                    },
                },
                {
                    $addFields: {
                        userData: { $arrayElemAt: ["$userData", 0] },
                        clientData: { $arrayElemAt: ["$clientData", 0] },
                        lawyerData: { $arrayElemAt: ["$lawyerData", 0] },
                    },
                },
                {
                    $project: { "lawyerData.documents": 0 },
                },
            ];
            dataPipeline.push(...clientlookups);
            countPipeline.push(...clientlookups);
        }
        const matchStage2 = {
            $or: [
                { "userData.name": { $regex: search, $options: "i" } },
                { "userData.email": { $regex: search, $options: "i" } },
            ],
        };
        dataPipeline.push({ $match: matchStage2 }, { $project: { "userData.password": 0 } }, { $sort: sortStage }, { $skip: (page - 1) * limit }, { $limit: limit });
        countPipeline.push({ $count: "total" });
        const [dataResult, countResult] = await Promise.all([
            SessionModel_1.default.aggregate(dataPipeline),
            SessionModel_1.default.aggregate(countPipeline),
        ]);
        // console.log("dataResult", dataResult);
        const totalCount = countResult[0]?.total || 0;
        const totalPage = Math.ceil(totalCount / limit);
        return {
            data: dataResult,
            totalCount,
            currentPage: page,
            totalPage,
        };
    }
    async create(payload) {
        const newpayload = this.mapper.toPersistence(payload);
        const newSessions = new SessionModel_1.default(newpayload);
        const savedSession = await newSessions.save({
            session: this.clientSession,
        });
        return this.mapper.toDomain(savedSession);
    }
    async update(payload) {
        const update = {};
        if (payload.status) {
            update.status = payload.status;
        }
        if (payload.start_time) {
            update.start_time = payload.start_time;
        }
        if (payload.end_time) {
            update.end_time = payload.end_time;
        }
        if (payload.client_joined_at) {
            update.client_joined_at = payload.client_joined_at;
        }
        if (payload.lawyer_joined_at) {
            update.lawyer_joined_at = payload.lawyer_joined_at;
        }
        if (payload.client_left_at) {
            update.client_left_at = payload.client_left_at;
        }
        if (payload.lawyer_left_at) {
            update.lawyer_left_at = payload.lawyer_left_at;
        }
        if (payload.end_reason) {
            update.end_reason = payload.end_reason;
        }
        if (payload.callDuration) {
            update.callDuration = payload.callDuration;
        }
        if (payload.notes) {
            update.notes = payload.notes;
        }
        if (payload.summary) {
            update.summary = payload.summary;
        }
        if (payload.follow_up_suggested) {
            update.follow_up_suggested = payload.follow_up_suggested;
        }
        if (payload.follow_up_session_id) {
            update.follow_up_session_id = payload.follow_up_session_id;
        }
        update.room_id = payload.room_id;
        if (Object.keys(update).length === 0) {
            return null;
        }
        const sessions = await SessionModel_1.default.findOneAndUpdate({
            _id: payload.session_id,
        }, { $set: update }, { new: true, session: this.clientSession });
        return sessions ? this.mapper.toDomain(sessions) : null;
    }
    async findById(payload) {
        const sessions = await SessionModel_1.default.findById(payload.session_id);
        return sessions ? this.mapper.toDomain(sessions) : null;
    }
    async findSessionsAggregate(payload) {
        const { search, limit, page, sortBy, sortOrder, status, consultation_type, user_id, } = payload;
        const skip = (page - 1) * limit;
        const order = sortOrder === "asc" ? 1 : -1;
        console.log({
            sortBy,
            sortOrder,
        });
        const matchStage = {};
        if (user_id) {
            matchStage["$or"] = [{ client_id: user_id }, { lawyer_id: user_id }];
        }
        if (status && status !== "all")
            matchStage.status = status;
        let matchStage2 = {
            $or: [
                { "clientData.name": { $regex: search, $options: "i" } },
                { "clientData.email": { $regex: search, $options: "i" } },
                { "lawyerData.name": { $regex: search, $options: "i" } },
                { "lawyerData.email": { $regex: search, $options: "i" } },
            ],
        };
        if (consultation_type && consultation_type !== "all") {
            matchStage2 = {
                $and: [matchStage2, { "appointmentDetails.type": consultation_type }],
            };
        }
        const sortStage = (() => {
            switch (sortBy) {
                case "amount":
                    return { "appointmentDetails.amount": order };
                case "date":
                    return { "appointmentDetails.date": order };
                case "client_name":
                    return { "clientData.name": order };
                case "lawyer_name":
                    return { "lawyerData.name": order };
                default:
                    return { "appointmentDetails.date": -1 };
            }
        })();
        const projectStage = {
            $project: {
                id: "$_id",
                // appointment details
                appointmentDetails: {
                    id: "$appointmentDetails._id",
                    bookingId: "$appointmentDetails.bookingId",
                    lawyer_id: "$appointmentDetails.lawyer_id",
                    client_id: "$appointmentDetails.client_id",
                    caseId: "$appointmentDetails.caseId",
                    date: "$appointmentDetails.date",
                    time: "$appointmentDetails.time",
                    duration: "$appointmentDetails.duration",
                    reason: "$appointmentDetails.reason",
                    amount: "$appointmentDetails.amount",
                    payment_status: "$appointmentDetails.payment_status",
                    type: "$appointmentDetails.type",
                    status: "$appointmentDetails.status",
                },
                // session fields
                lawyer_id: "$lawyer_id",
                client_id: "$client_id",
                caseId: "$caseId",
                bookingId: "$bookingId",
                status: "$status",
                notes: "$notes",
                summary: "$summary",
                follow_up_suggested: "$follow_up_suggested",
                follow_up_session_id: "$follow_up_session_id",
                room_id: "$room_id",
                start_time: "$start_time",
                end_time: "$end_time",
                client_joined_at: "$client_joined_at",
                client_left_at: "$client_left_at",
                lawyer_joined_at: "$lawyer_joined_at",
                lawyer_left_at: "$lawyer_left_at",
                end_reason: "$end_reason",
                callDuration: "$callDuration",
                createdAt: "$createdAt",
                updatedAt: "$updatedAt",
                // client info
                clientData: {
                    name: "$clientData.name",
                    email: "$clientData.email",
                    mobile: "$clientData.mobile",
                    user_id: "$clientData.user_id",
                    profile_image: "$clientData.profile_image",
                    dob: "$clientData.dob",
                    gender: "$clientData.gender",
                },
                // lawyer info
                lawyerData: {
                    name: "$lawyerData.name",
                    email: "$lawyerData.email",
                    mobile: "$lawyerData.mobile",
                    user_id: "$lawyerData.user_id",
                    profile_image: "$lawyerData.profile_image",
                    dob: "$lawyerData.dob",
                    gender: "$lawyerData.gender",
                },
            },
        };
        const pipeline = [
            { $match: matchStage },
            {
                $lookup: {
                    from: "users",
                    localField: "client_id",
                    foreignField: "user_id",
                    as: "clientsUserData",
                },
            },
            {
                $unwind: { path: "$clientsUserData", preserveNullAndEmptyArrays: true },
            },
            {
                $lookup: {
                    from: "clients",
                    localField: "client_id",
                    foreignField: "user_id",
                    as: "clientsClientData",
                },
            },
            {
                $unwind: {
                    path: "$clientsClientData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    clientData: {
                        $mergeObjects: ["$clientsUserData", "$clientsClientData"],
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "lawyer_id",
                    foreignField: "user_id",
                    as: "lawyersUserData",
                },
            },
            {
                $unwind: { path: "$lawyersUserData", preserveNullAndEmptyArrays: true },
            },
            {
                $lookup: {
                    from: "clients",
                    localField: "lawyer_id",
                    foreignField: "user_id",
                    as: "lawyersClientData",
                },
            },
            {
                $unwind: {
                    path: "$lawyersClientData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "appointments",
                    localField: "appointment_id",
                    foreignField: "_id",
                    as: "appointmentDetails",
                },
            },
            {
                $unwind: {
                    path: "$appointmentDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    lawyerData: {
                        $mergeObjects: ["$lawyersUserData", "$lawyersClientData"],
                    },
                },
            },
            projectStage,
        ];
        const [dataResult, countResult] = await Promise.all([
            SessionModel_1.default.aggregate([
                ...pipeline,
                { $match: matchStage2 },
                { $sort: sortStage },
                { $skip: skip },
                { $limit: limit },
            ]),
            SessionModel_1.default.aggregate([
                ...pipeline,
                { $match: matchStage2 },
                { $count: "total" },
            ]),
        ]);
        const totalCount = countResult[0]?.total || 0;
        const totalPage = Math.ceil(totalCount / limit);
        return {
            data: dataResult,
            totalCount,
            currentPage: page,
            totalPage,
        };
    }
    async findByCase(id) {
        const data = await SessionModel_1.default.aggregate([
            { $match: { caseId: id } },
            {
                $lookup: {
                    from: "users",
                    localField: "client_id",
                    foreignField: "user_id",
                    as: "clientsUserData",
                },
            },
            {
                $unwind: { path: "$clientsUserData", preserveNullAndEmptyArrays: true },
            },
            {
                $lookup: {
                    from: "clients",
                    localField: "client_id",
                    foreignField: "user_id",
                    as: "clientsClientData",
                },
            },
            {
                $unwind: {
                    path: "$clientsClientData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    clientData: {
                        $mergeObjects: ["$clientsUserData", "$clientsClientData"],
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "lawyer_id",
                    foreignField: "user_id",
                    as: "lawyersUserData",
                },
            },
            {
                $unwind: { path: "$lawyersUserData", preserveNullAndEmptyArrays: true },
            },
            {
                $lookup: {
                    from: "clients",
                    localField: "lawyer_id",
                    foreignField: "user_id",
                    as: "lawyersClientData",
                },
            },
            {
                $unwind: {
                    path: "$lawyersClientData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "appointments",
                    localField: "appointment_id",
                    foreignField: "_id",
                    as: "appointmentDetails",
                },
            },
            {
                $unwind: {
                    path: "$appointmentDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    lawyerData: {
                        $mergeObjects: ["$lawyersUserData", "$lawyersClientData"],
                    },
                },
            },
            {
                $project: {
                    id: "$_id",
                    // appointment details
                    appointmentDetails: {
                        id: "$appointmentDetails._id",
                        bookingId: "$appointmentDetails.bookingId",
                        lawyer_id: "$appointmentDetails.lawyer_id",
                        client_id: "$appointmentDetails.client_id",
                        caseId: "$appointmentDetails.caseId",
                        date: "$appointmentDetails.date",
                        time: "$appointmentDetails.time",
                        duration: "$appointmentDetails.duration",
                        reason: "$appointmentDetails.reason",
                        amount: "$appointmentDetails.amount",
                        payment_status: "$appointmentDetails.payment_status",
                        type: "$appointmentDetails.type",
                        status: "$appointmentDetails.status",
                    },
                    // session fields
                    lawyer_id: "$lawyer_id",
                    client_id: "$client_id",
                    caseId: "$caseId",
                    bookingId: "$bookingId",
                    status: "$status",
                    notes: "$notes",
                    summary: "$summary",
                    follow_up_suggested: "$follow_up_suggested",
                    follow_up_session_id: "$follow_up_session_id",
                    room_id: "$room_id",
                    start_time: "$start_time",
                    end_time: "$end_time",
                    client_joined_at: "$client_joined_at",
                    client_left_at: "$client_left_at",
                    lawyer_joined_at: "$lawyer_joined_at",
                    lawyer_left_at: "$lawyer_left_at",
                    end_reason: "$end_reason",
                    callDuration: "$callDuration",
                    createdAt: "$createdAt",
                    updatedAt: "$updatedAt",
                    // client info
                    clientData: {
                        name: "$clientData.name",
                        email: "$clientData.email",
                        mobile: "$clientData.mobile",
                        user_id: "$clientData.user_id",
                        profile_image: "$clientData.profile_image",
                        dob: "$clientData.dob",
                        gender: "$clientData.gender",
                    },
                    // lawyer info
                    lawyerData: {
                        name: "$lawyerData.name",
                        email: "$lawyerData.email",
                        mobile: "$lawyerData.mobile",
                        user_id: "$lawyerData.user_id",
                        profile_image: "$lawyerData.profile_image",
                        dob: "$lawyerData.dob",
                        gender: "$lawyerData.gender",
                    },
                },
            },
        ]);
        return data;
    }
    async findByUserId(userId) {
        const data = await SessionModel_1.default.find({
            $or: [{ client_id: userId }, { lawyer_id: userId }],
        });
        return data && this.mapper.toDomainArray
            ? this.mapper.toDomainArray(data)
            : [];
    }
}
exports.SessionsRepository = SessionsRepository;
