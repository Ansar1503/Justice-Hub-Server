"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisputesRepo = void 0;
const DisputesMapper_1 = require("@infrastructure/Mapper/Implementations/DisputesMapper");
const DisputesModel_1 = require("../model/DisputesModel");
const BaseRepo_1 = require("./base/BaseRepo");
class DisputesRepo extends BaseRepo_1.BaseRepository {
    constructor(mapper = new DisputesMapper_1.DisputesMapper()) {
        super(DisputesModel_1.DisputesModel, mapper);
    }
    async findByContentId(payload) {
        const disputes = await DisputesModel_1.DisputesModel.findOne({
            contentId: payload.contentId,
        });
        return disputes ? this.mapper.toDomain(disputes) : null;
    }
    async findById(id) {
        const disputes = await DisputesModel_1.DisputesModel.findOne({ _id: id });
        if (!disputes)
            return null;
        return this.mapper.toDomain(disputes);
    }
    async update(payload) {
        const update = { status: payload.status, resolveAction: payload.action };
        const updated = await DisputesModel_1.DisputesModel.findOneAndUpdate({
            _id: payload.disputesId,
        }, update, { new: true });
        if (!updated)
            return null;
        return this.mapper.toDomain(updated);
    }
    async findReviewDisputes(payload) {
        const { limit, page, search, sortBy, sortOrder } = payload;
        const skip = (page - 1) * limit;
        const order = sortOrder === "asc" ? 1 : -1;
        const matchFilter1 = {
            disputeType: "reviews",
        };
        const matchFilter2 = {};
        if (search.trim()) {
            matchFilter2["$or"] = [
                { "reportedByuserData.name": search },
                { "reportedUserData.name": search },
            ];
        }
        const sortFilter = { createdAt: order };
        if (sortBy !== "All" && sortBy === "reported_date") {
            sortFilter["createdAt"] = order;
        }
        if (sortBy !== "All" && sortBy === "review_date") {
            sortFilter["reviewData.createdAt"] = order;
        }
        const pipeline = [
            { $match: matchFilter1 },
            {
                $lookup: {
                    from: "reviews",
                    localField: "contentId",
                    foreignField: "_id",
                    as: "contentData",
                },
            },
            { $unwind: { path: "$contentData", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "users",
                    localField: "reportedBy",
                    foreignField: "user_id",
                    as: "reportedByusersUserData",
                },
            },
            {
                $unwind: {
                    path: "$reportedByusersUserData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "clients",
                    localField: "reportedBy",
                    foreignField: "user_id",
                    as: "reportedByUserClientData",
                },
            },
            {
                $unwind: {
                    path: "$reportedByUserClientData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "reportedUser",
                    foreignField: "user_id",
                    as: "reportedUsersUserData",
                },
            },
            {
                $unwind: {
                    path: "$reportedUsersUserData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "clients",
                    localField: "reportedUser",
                    foreignField: "user_id",
                    as: "reportedUserClientData",
                },
            },
            {
                $unwind: {
                    path: "$reportedUserClientData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    reportedByuserData: {
                        $mergeObjects: [
                            "$reportedByusersUserData",
                            "$reportedByUserClientData",
                        ],
                    },
                },
            },
            {
                $addFields: {
                    reportedUserData: {
                        $mergeObjects: [
                            "$reportedUsersUserData",
                            "$reportedUserClientData",
                        ],
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    disputeType: 1,
                    contentId: 1,
                    reportedBy: 1,
                    reportedUser: 1,
                    reason: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    contentData: {
                        _id: "$contentData._id",
                        session_id: "$contentData.session_id",
                        heading: "$contentData.heading",
                        review: "$contentData.review",
                        active: "$contentData.active",
                        rating: "$contentData.rating",
                        client_id: "$contentData.client_id",
                        lawyer_id: "$contentData.lawyer_id",
                        createdAt: "$contentData.createdAt",
                        updatedAt: "$contentData.updatedAt  ",
                    },
                    reportedByuserData: {
                        name: "$reportedByuserData.name",
                        email: "$reportedByuserData.email",
                        mobile: "$reportedByuserData.mobile",
                        user_id: "$reportedByuserData.user_id",
                        profile_image: "$reportedByuserData.profile_image",
                        dob: "$reportedByuserData.dob",
                        gender: "$reportedByuserData.gender",
                    },
                    reportedUserData: {
                        name: "$reportedUserData.name",
                        email: "$reportedUserData.email",
                        mobile: "$reportedUserData.mobile",
                        user_id: "$reportedUserData.user_id",
                        profile_image: "$reportedUserData.profile_image",
                        dob: "$reportedUserData.dob",
                        gender: "$reportedUserData.gender",
                    },
                },
            },
            { $match: matchFilter2 },
            { $sort: sortFilter },
            { $skip: skip },
            { $limit: limit },
        ];
        const [{ data, count }] = await DisputesModel_1.DisputesModel.aggregate([
            {
                $facet: {
                    data: pipeline,
                    count: [
                        { $match: matchFilter1 },
                        { $match: matchFilter2 },
                        { $count: "count" },
                    ],
                },
            },
        ]);
        const totalCount = count[0]?.count || 0;
        const totalPage = Math.ceil(totalCount / limit);
        return {
            currentPage: page,
            totalPage,
            totalCount,
            data: data?.map((d) => ({
                id: d._id,
                disputeType: d.disputeType,
                contentId: d.contentId,
                reportedBy: d.reportedBy,
                reportedUser: d.reportedUser,
                reason: d.reason,
                status: d.status,
                createdAt: d.createdAt,
                updatedAt: d.updatedAt,
                contentData: {
                    id: d.contentData._id,
                    session_id: d.contentData.session_id,
                    heading: d.contentData.heading,
                    review: d.contentData.review,
                    active: d.contentData.active,
                    rating: d.contentData.rating,
                    client_id: d.contentData.client_id,
                    lawyer_id: d.contentData.lawyer_id,
                    createdAt: d.contentData.createdAt,
                    updatedAt: d.contentData.updatedAt,
                },
                reportedByuserData: {
                    user_id: d.reportedByuserData.user_id,
                    name: d.reportedByuserData.name,
                    email: d.reportedByuserData.email,
                    mobile: d.reportedByuserData.mobile,
                    profile_image: d.reportedByuserData.profile_image,
                    dob: d.reportedByuserData.dob,
                    gender: d.reportedByuserData.gender,
                },
                reportedUserData: {
                    user_id: d.reportedUserData.user_id,
                    name: d.reportedUserData.name,
                    email: d.reportedUserData.email,
                    mobile: d.reportedUserData.mobile,
                    profile_image: d.reportedUserData.profile_image,
                    dob: d.reportedUserData.dob,
                    gender: d.reportedUserData.gender,
                },
            })),
        };
    }
    async findAllChatDisputes(payload) {
        const { limit, page, search, sortBy, sortOrder } = payload;
        const skip = (page - 1) * limit;
        const order = sortOrder === "asc" ? 1 : -1;
        const matchFilter1 = { disputeType: "messages" };
        const matchFilter2 = {};
        if (search.trim()) {
            matchFilter2["$or"] = [
                { "reportedBy.name": search },
                { "reportedUser.name": search },
            ];
        }
        const sortFilter = { createdAt: order };
        if (sortBy === "message_date") {
            sortFilter["chatMessage.createdAt"] = order;
        }
        const pipeline = [
            { $match: matchFilter1 },
            {
                $lookup: {
                    from: "messages",
                    localField: "contentId",
                    foreignField: "_id",
                    as: "chatMessage",
                },
            },
            { $unwind: { path: "$chatMessage", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "users",
                    localField: "reportedBy",
                    foreignField: "user_id",
                    as: "reportedByUserData",
                },
            },
            {
                $unwind: {
                    path: "$reportedByUserData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "clients",
                    localField: "reportedBy",
                    foreignField: "user_id",
                    as: "reportedByClientData",
                },
            },
            {
                $unwind: {
                    path: "$reportedByClientData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "reportedUser",
                    foreignField: "user_id",
                    as: "reportedUsersUserData",
                },
            },
            {
                $unwind: {
                    path: "$reportedUsersUserData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "clients",
                    localField: "reportedUser",
                    foreignField: "user_id",
                    as: "reportedUserClientData",
                },
            },
            {
                $unwind: {
                    path: "$reportedUserClientData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    reportedBy: {
                        $mergeObjects: ["$reportedByUserData", "$reportedByClientData"],
                    },
                },
            },
            {
                $addFields: {
                    reportedUser: {
                        $mergeObjects: [
                            "$reportedUsersUserData",
                            "$reportedUserClientData",
                        ],
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    disputeType: 1,
                    resolveAction: 1,
                    "chatMessage._id": 1,
                    "chatMessage.session_id": 1,
                    "chatMessage.content": 1,
                    "chatMessage.read": 1,
                    "chatMessage.attachments": 1,
                    "chatMessage.createdAt": 1,
                    "chatMessage.updatedAt": 1,
                    "reportedBy.user_id": 1,
                    "reportedBy.name": 1,
                    "reportedBy.email": 1,
                    "reportedBy.mobile": 1,
                    "reportedBy.profile_image": 1,
                    "reportedUser.user_id": 1,
                    "reportedUser.name": 1,
                    "reportedUser.email": 1,
                    "reportedUser.mobile": 1,
                    "reportedUser.profile_image": 1,
                    reason: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
            { $match: matchFilter2 },
            { $sort: sortFilter },
            { $skip: skip },
            { $limit: limit },
        ];
        const [{ data, count }] = await DisputesModel_1.DisputesModel.aggregate([
            {
                $facet: {
                    data: pipeline,
                    count: [
                        { $match: matchFilter1 },
                        { $match: matchFilter2 },
                        { $count: "count" },
                    ],
                },
            },
        ]);
        const totalCount = count[0]?.count || 0;
        const totalPage = Math.ceil(totalCount / limit);
        // console.log("data ::", data);
        return {
            data: data
                ? data?.map((d) => ({
                    id: d._id,
                    disputeType: d.disputeType,
                    reason: d.reason,
                    status: d.status,
                    resolveAction: d.resolveAction,
                    createdAt: d.createdAt,
                    updatedAt: d.updatedAt,
                    reportedBy: {
                        user_id: d.reportedBy.user_id,
                        name: d.reportedBy.name,
                        email: d.reportedBy.email,
                        mobile: d.reportedBy.mobile,
                        profile_image: d.reportedBy.profile_image,
                    },
                    reportedUser: {
                        user_id: d.reportedUser.user_id,
                        name: d.reportedUser.name,
                        email: d.reportedUser.email,
                        mobile: d.reportedUser.mobile,
                        profile_image: d.reportedUser.profile_image,
                    },
                    chatMessage: {
                        id: d.chatMessage?._id,
                        session_id: d.chatMessage?.session_id,
                        content: d.chatMessage?.content,
                        read: d.chatMessage?.read,
                        attachments: d.chatMessage?.attachments,
                        createdAt: d.chatMessage?.createdAt,
                        updatedAt: d.chatMessage?.updatedAt,
                    },
                }))
                : [],
            totalPage,
            totalCount,
            currentPage: page,
        };
    }
    async getRecentDisputes(limit) {
        const data = await this.model.aggregate([
            { $sort: { createdAt: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: "users",
                    localField: "reportedBy",
                    foreignField: "user_id",
                    as: "reporter",
                },
            },
            { $unwind: { path: "$reporter", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    type: "$disputeType",
                    status: 1,
                    reportedBy: { $ifNull: ["$reporter.name", "$reportedBy"] },
                },
            },
        ]);
        return data;
    }
    async countOpen() {
        return await this.model.countDocuments({ status: "pending" });
    }
}
exports.DisputesRepo = DisputesRepo;
