"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppointmentMapper_1 = require("@infrastructure/Mapper/Implementations/AppointmentMapper");
const AppointmentsModel_1 = require("../model/AppointmentsModel");
// import {
//   FetchAppointmentsInputDto,
//   FetchAppointmentsOutputDto,
// } from "@src/application/dtos/Admin/FetchAppointmentsDto";
const BaseRepo_1 = require("./base/BaseRepo");
class AppointmentsRepository extends BaseRepo_1.BaseRepository {
    constructor(session) {
        super(AppointmentsModel_1.AppointmentModel, new AppointmentMapper_1.AppointmentMapper(), session);
    }
    async createWithTransaction(payload) {
        const inputDate = payload.date;
        const startOfDay = new Date(inputDate);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(inputDate);
        endOfDay.setUTCHours(23, 59, 59, 999);
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        try {
            const existing = await AppointmentsModel_1.AppointmentModel.findOne({
                lawyer_id: payload.lawyer_id,
                date: { $gte: startOfDay, $lte: endOfDay },
                time: payload.time,
            }).session(session);
            if (existing) {
                const error = new Error("Slot already booked");
                error.code = 409;
                throw error;
            }
            const newAppointment = new AppointmentsModel_1.AppointmentModel(this.mapper.toPersistence(payload));
            await newAppointment.save({ session });
            await session.commitTransaction();
            return this.mapper.toDomain(newAppointment);
        }
        catch (error) {
            await session.abortTransaction();
        }
        finally {
            session.endSession();
        }
        const error = new Error("Failed to create appointment");
        error.code = 500;
        throw error;
    }
    async findByDateandLawyer_id(payload) {
        const startOfDay = new Date(payload.date).setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(payload.date).setUTCHours(23, 59, 59, 999);
        const data = await AppointmentsModel_1.AppointmentModel.find({
            lawyer_id: payload.lawyer_id,
            date: { $gte: startOfDay, $lte: endOfDay },
        });
        return this.mapper.toDomainArray && data
            ? this.mapper.toDomainArray(data)
            : null;
    }
    async findByDateandClientId(payload) {
        const startOfDay = new Date(payload.date).setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(payload.date).setUTCHours(23, 59, 59, 999);
        return await AppointmentsModel_1.AppointmentModel.find({
            client_id: payload.client_id,
            date: { $gte: startOfDay, $lte: endOfDay },
        });
    }
    async Update(payload) {
        if (!payload.date) {
            return null;
        }
        const startOfDay = new Date(payload?.date).setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(payload?.date).setUTCHours(23, 59, 59, 999);
        const updated = await AppointmentsModel_1.AppointmentModel.findOneAndUpdate({
            client_id: payload.client_id,
            lawyer_id: payload.lawyer_id,
            date: { $gte: startOfDay, $lte: endOfDay },
            time: payload.time,
            duration: payload.duration,
        }, {
            $set: {
                payment_status: payload.payment_status,
                status: payload.status,
            },
        }, {
            new: true,
        });
        return updated ? this.mapper.toDomain(updated) : null;
    }
    async delete(payload) {
        if (!payload.date) {
            return null;
        }
        const startOfDay = new Date(payload?.date).setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(payload?.date).setUTCHours(23, 59, 59, 999);
        const afterDelete = await AppointmentsModel_1.AppointmentModel.findOneAndDelete({
            client_id: payload.client_id,
            lawyer_id: payload.lawyer_id,
            date: { $gte: startOfDay, $lte: endOfDay },
            time: payload.time,
            duration: payload.duration,
        });
        return afterDelete ? this.mapper.toDomain(afterDelete) : null;
    }
    async findForClientsUsingAggregation(payload) {
        const { client_id, search = "", appointmentStatus = "all", appointmentType = "all", sortField = "name", sortOrder = "desc", page = 1, limit = 10, } = payload;
        const matchStage = { client_id };
        const sortStage = {
            [sortField]: sortOrder === "asc" ? 1 : -1,
        };
        if (sortField == "name") {
            sortStage["userData.name"] = sortOrder === "asc" ? 1 : -1;
        }
        else if (sortField === "consultation_fee") {
            sortStage["lawyerData.consultation_fee"] = sortOrder === "asc" ? 1 : -1;
        }
        const matchStage2 = {};
        if (appointmentStatus && appointmentStatus !== "all") {
            matchStage["status"] = appointmentStatus;
        }
        if (appointmentType && appointmentType !== "all") {
            matchStage["type"] = appointmentType;
        }
        const countPipeline = [{ $match: matchStage }];
        const dataPipeline = [{ $match: matchStage }];
        const lookups = [
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
                    localField: "lawyer_id",
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
        ];
        matchStage2["$or"] = [
            { "userData.name": { $regex: search, $options: "i" } },
            { "userData.email": { $regex: search, $options: "i" } },
        ];
        dataPipeline.push(...lookups, { $match: matchStage2 }, { $project: { "userData.password": 0, "lawyerData.documents": 0 } }, { $sort: sortStage }, { $skip: (page - 1) * limit }, { $limit: limit });
        countPipeline.push(...lookups, { $count: "total" });
        const [dataResult, countResult] = await Promise.all([
            AppointmentsModel_1.AppointmentModel.aggregate(dataPipeline),
            AppointmentsModel_1.AppointmentModel.aggregate(countPipeline),
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
    async findForLawyersUsingAggregation(payload) {
        const { lawyer_id, search = "", appointmentStatus = "all", appointmentType = "all", sortField = "created_at", sortOrder = "desc", page = 1, limit = 10, } = payload;
        const matchStage = { lawyer_id };
        const sortStage = {
            [sortField]: sortOrder === "asc" ? 1 : -1,
        };
        if (sortField == "name") {
            sortStage["userData.name"] = sortOrder === "asc" ? 1 : -1;
        }
        else if (sortField === "consultation_fee") {
            sortStage["lawyerData.consultation_fee"] = sortOrder === "asc" ? 1 : -1;
        }
        else if (sortField === "date") {
            sortStage["date"] = sortOrder === "asc" ? 1 : -1;
        }
        else if (sortField === "created_at") {
            sortStage["created_at"] = sortOrder === "asc" ? 1 : -1;
        }
        const matchStage2 = {};
        if (appointmentStatus && appointmentStatus !== "all") {
            matchStage["status"] = appointmentStatus;
        }
        if (appointmentType && appointmentType !== "all") {
            matchStage["type"] = appointmentType;
        }
        const countPipeline = [{ $match: matchStage }];
        const dataPipeline = [{ $match: matchStage }];
        const lookups = [
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
        ];
        matchStage2["$or"] = [
            { "userData.name": { $regex: search, $options: "i" } },
            { "userData.email": { $regex: search, $options: "i" } },
        ];
        dataPipeline.push(...lookups, { $match: matchStage2 }, { $project: { "userData.password": 0, "lawyerData.documents": 0 } }, { $sort: sortStage }, { $skip: (page - 1) * limit }, { $limit: limit });
        countPipeline.push(...lookups, { $count: "total" });
        const [dataResult, countResult] = await Promise.all([
            AppointmentsModel_1.AppointmentModel.aggregate(dataPipeline),
            AppointmentsModel_1.AppointmentModel.aggregate(countPipeline),
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
    async updateWithId(payload) {
        return await AppointmentsModel_1.AppointmentModel.findOneAndUpdate({ _id: payload.id }, { $set: { status: payload.status } }, { new: true, session: this.session });
    }
    async findById(id) {
        return await AppointmentsModel_1.AppointmentModel.findOne({ _id: id });
    }
    async findAllAggregate(payload) {
        const { search, limit, page, sortBy, sortOrder, appointmentStatus, consultationType, user_id, } = payload;
        const skip = (page - 1) * limit;
        const order = sortOrder === "asc" ? 1 : -1;
        const matchStage = {};
        if (user_id) {
            matchStage["$or"] = [{ client_id: user_id }, { lawyer_id: user_id }];
        }
        if (consultationType && consultationType !== "all") {
            matchStage["type"] = consultationType;
        }
        if (appointmentStatus && appointmentStatus !== "all") {
            matchStage["status"] = appointmentStatus;
        }
        const matchStage2 = {
            $or: [
                { "clientData.name": { $regex: search, $options: "i" } },
                { "clientData.email": { $regex: search, $options: "i" } },
                { "lawyerData.name": { $regex: search, $options: "i" } },
                { "lawyerData.email": { $regex: search, $options: "i" } },
            ],
        };
        const sortStage = {};
        switch (sortBy) {
            case "fee":
                sortStage["amount"] = order;
            case "date":
                sortStage["createdAt"] = order;
            case "client_name":
                sortStage["clientData.name"] = order;
            case "lawyer_name":
                sortStage["lawyerData.name"] = order;
        }
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
                $unwind: {
                    path: "$clientsUserData",
                    preserveNullAndEmptyArrays: true,
                },
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
                $unwind: {
                    path: "$lawyersUserData",
                    preserveNullAndEmptyArrays: true,
                },
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
                $addFields: {
                    lawyerData: {
                        $mergeObjects: ["$lawyersUserData", "$lawyersClientData"],
                    },
                },
            },
            {
                $project: {
                    clientData: {
                        name: "$clientData.name",
                        email: "$clientData.email",
                        mobile: "$clientData.mobile",
                        user_id: "$clientData.user_id",
                        profile_image: "$clientData.profile_image",
                        dob: "$clientData.dob",
                        gender: "$clientData.gender",
                    },
                    lawyerData: {
                        name: "$lawyerData.name",
                        email: "$lawyerData.email",
                        mobile: "$lawyerData.mobile",
                        user_id: "$lawyerData.user_id",
                        profile_image: "$lawyerData.profile_image",
                        dob: "$lawyerData.dob",
                        gender: "$lawyerData.gender",
                    },
                    id: "$_id",
                    caseId: "$caseId",
                    lawyer_id: "$lawyer_id",
                    client_id: "$client_id",
                    bookingId: "$bookingId",
                    date: "$date",
                    time: "$time",
                    duration: "$duration",
                    reason: "$reason",
                    amount: "$amount",
                    payment_status: "$payment_status",
                    type: "$type",
                    status: "$status",
                    createdAt: "$createdAt",
                    updatedAt: "$updatedAt",
                },
            },
        ];
        const [dataResult, countResult] = await Promise.all([
            AppointmentsModel_1.AppointmentModel.aggregate([
                ...pipeline,
                { $match: matchStage2 },
                { $sort: sortStage },
                { $skip: skip },
                { $limit: limit },
            ]),
            AppointmentsModel_1.AppointmentModel.aggregate([
                ...pipeline,
                { $match: matchStage2 },
                { $sort: sortStage },
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
    async findByClientID(client) {
        const data = await AppointmentsModel_1.AppointmentModel.find({
            $or: [{ client_id: client }, { lawyer_id: client }],
        });
        return this.mapper.toDomainArray && data
            ? this.mapper.toDomainArray(data)
            : [];
    }
    async findByCaseId(id) {
        const data = await this.model.aggregate([
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
                $unwind: {
                    path: "$clientsUserData",
                    preserveNullAndEmptyArrays: true,
                },
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
                $unwind: {
                    path: "$lawyersUserData",
                    preserveNullAndEmptyArrays: true,
                },
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
                $addFields: {
                    lawyerData: {
                        $mergeObjects: ["$lawyersUserData", "$lawyersClientData"],
                    },
                },
            },
            {
                $project: {
                    clientData: {
                        name: "$clientData.name",
                        email: "$clientData.email",
                        mobile: "$clientData.mobile",
                        user_id: "$clientData.user_id",
                        profile_image: "$clientData.profile_image",
                        dob: "$clientData.dob",
                        gender: "$clientData.gender",
                    },
                    lawyerData: {
                        name: "$lawyerData.name",
                        email: "$lawyerData.email",
                        mobile: "$lawyerData.mobile",
                        user_id: "$lawyerData.user_id",
                        profile_image: "$lawyerData.profile_image",
                        dob: "$lawyerData.dob",
                        gender: "$lawyerData.gender",
                    },
                    id: "$_id",
                    caseId: "$caseId",
                    lawyer_id: "$lawyer_id",
                    client_id: "$client_id",
                    bookingId: "$bookingId",
                    date: "$date",
                    time: "$time",
                    duration: "$duration",
                    reason: "$reason",
                    amount: "$amount",
                    payment_status: "$payment_status",
                    type: "$type",
                    status: "$status",
                    createdAt: "$createdAt",
                    updatedAt: "$updatedAt",
                },
            },
        ]);
        return data;
    }
    async findByBookingId(id) {
        const data = await this.model.findOne({ bookingId: id });
        return data ? this.mapper.toDomain(data) : null;
    }
    async findAppointmentsByLawyerAndRange(lawyer_id, startDate, endDate) {
        const data = await this.model.find({
            lawyer_id,
            date: { $gte: startDate, $lte: endDate },
        });
        return data && this.mapper.toDomainArray
            ? this.mapper.toDomainArray(data)
            : [];
    }
}
exports.AppointmentsRepository = AppointmentsRepository;
