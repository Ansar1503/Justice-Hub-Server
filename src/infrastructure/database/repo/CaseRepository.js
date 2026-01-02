"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseRepository = void 0;
const CaseModel_1 = require("../model/CaseModel");
const BaseRepo_1 = require("./base/BaseRepo");
class CaseRepository extends BaseRepo_1.BaseRepository {
    constructor(mapper, session) {
        super(CaseModel_1.CaseModel, mapper, session);
    }
    async findByQuery(payload) {
        const { limit, page, search, sortBy, sortOrder, userId, caseTypeFilter, status, } = payload;
        const skip = (page - 1) * limit;
        const order = sortOrder === "asc" ? 1 : -1;
        const matchStage1 = {
            $and: [{ $or: [{ clientId: userId }, { lawyerId: userId }] }],
        };
        const matchStage2 = {};
        const sortStage = {};
        if (search?.trim()) {
            matchStage1.$and.push({
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { summary: { $regex: search, $options: "i" } },
                ],
            });
            matchStage2["$or"] = [
                { "clientDetails.name": { $regex: search, $options: "i" } },
                { "lawyerDetails.name": { $regex: search, $options: "i" } },
            ];
        }
        switch (sortBy) {
            case "date":
                sortStage["createdAt"] = order;
                break;
            case "title":
                sortStage["title"] = order;
                break;
            case "client":
                sortStage["clientDetails.name"] = order;
                break;
            case "lawyer":
                sortStage["lawyerDetails.name"] = order;
                break;
        }
        if (caseTypeFilter?.trim()) {
            matchStage1["caseType"] = caseTypeFilter;
        }
        if (status?.trim()) {
            matchStage1["status"] = status;
        }
        const aggregateStage = [
            { $match: matchStage1 },
            {
                $lookup: {
                    from: "users",
                    localField: "clientId",
                    foreignField: "user_id",
                    as: "clientsUserDetails",
                },
            },
            {
                $unwind: {
                    path: "$clientsUserDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "lawyerId",
                    foreignField: "user_id",
                    as: "lawyersUserDetails",
                },
            },
            {
                $unwind: {
                    path: "$lawyersUserDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "clients",
                    localField: "clientId",
                    foreignField: "user_id",
                    as: "clientsClientDetails",
                },
            },
            {
                $unwind: {
                    path: "$clientsClientDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "clients",
                    localField: "lawyerId",
                    foreignField: "user_id",
                    as: "lawyersClientDetails",
                },
            },
            {
                $unwind: {
                    path: "$lawyersClientDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    clientDetails: {
                        $mergeObjects: [
                            { $ifNull: ["$clientsUserDetails", {}] },
                            { $ifNull: ["$clientsClientDetails", {}] },
                        ],
                    },
                    lawyerDetails: {
                        $mergeObjects: [
                            { $ifNull: ["$lawyersUserDetails", {}] },
                            { $ifNull: ["$lawyersClientDetails", {}] },
                        ],
                    },
                },
            },
            {
                $lookup: {
                    from: "casetypes",
                    localField: "caseType",
                    foreignField: "_id",
                    as: "caseTypeDetails",
                },
            },
            {
                $unwind: { path: "$caseTypeDetails", preserveNullAndEmptyArrays: true },
            },
            {
                $match: matchStage2,
            },
            {
                $project: {
                    id: "$_id",
                    title: "$title",
                    clientDetails: {
                        name: "$clientDetails.name",
                        email: "$clientDetails.email",
                        mobile: "$clientDetails.mobile",
                        userId: "$clientDetails.user_id",
                        profileImage: "$clientDetails.profile_image",
                        dob: "$clientDetails.dob",
                        gender: "$clientDetails.gender",
                    },
                    lawyerDetails: {
                        name: "$lawyerDetails.name",
                        email: "$lawyerDetails.email",
                        mobile: "$lawyerDetails.mobile",
                        userId: "$lawyerDetails.user_id",
                        profileImage: "$lawyerDetails.profile_image",
                        dob: "$lawyerDetails.dob",
                        gender: "$lawyerDetails.gender",
                    },
                    caseTypeDetails: {
                        id: "$caseTypeDetails._id",
                        name: "$caseTypeDetails.name",
                    },
                    summary: "$summary",
                    estimatedValue: "$estimatedValue",
                    nextHearing: "$nextHearing",
                    status: "$status",
                    createdAt: "$createdAt",
                    updatedAt: "$updatedAt",
                },
            },
        ];
        const result = await this.model.aggregate([
            ...aggregateStage,
            {
                $facet: {
                    data: [{ $sort: sortStage }, { $skip: skip }, { $limit: limit }],
                    count: [{ $count: "count" }],
                },
            },
        ]);
        const data = result[0]?.data || [];
        const totalCount = result[0]?.count[0]?.count || 0;
        return {
            currentPage: page,
            data: data,
            totalCount,
            totalPage: Math.ceil(totalCount / limit),
        };
    }
    async findById(id) {
        const data = await this.model.aggregate([
            { $match: { _id: id } },
            {
                $lookup: {
                    from: "users",
                    localField: "clientId",
                    foreignField: "user_id",
                    as: "clientsUserDetails",
                },
            },
            {
                $unwind: {
                    path: "$clientsUserDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "lawyerId",
                    foreignField: "user_id",
                    as: "lawyersUserDetails",
                },
            },
            {
                $unwind: {
                    path: "$lawyersUserDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "clients",
                    localField: "clientId",
                    foreignField: "user_id",
                    as: "clientsClientDetails",
                },
            },
            {
                $unwind: {
                    path: "$clientsClientDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "clients",
                    localField: "lawyerId",
                    foreignField: "user_id",
                    as: "lawyersClientDetails",
                },
            },
            {
                $unwind: {
                    path: "$lawyersClientDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    clientDetails: {
                        $mergeObjects: [
                            { $ifNull: ["$clientsUserDetails", {}] },
                            { $ifNull: ["$clientsClientDetails", {}] },
                        ],
                    },
                    lawyerDetails: {
                        $mergeObjects: [
                            { $ifNull: ["$lawyersUserDetails", {}] },
                            { $ifNull: ["$lawyersClientDetails", {}] },
                        ],
                    },
                },
            },
            {
                $lookup: {
                    from: "casetypes",
                    localField: "caseType",
                    foreignField: "_id",
                    as: "caseTypeDetails",
                },
            },
            {
                $unwind: { path: "$caseTypeDetails", preserveNullAndEmptyArrays: true },
            },
            {
                $project: {
                    id: "$_id",
                    title: "$title",
                    clientDetails: {
                        name: "$clientDetails.name",
                        email: "$clientDetails.email",
                        mobile: "$clientDetails.mobile",
                        userId: "$clientDetails.user_id",
                        profileImage: "$clientDetails.profile_image",
                        dob: "$clientDetails.dob",
                        gender: "$clientDetails.gender",
                    },
                    lawyerDetails: {
                        name: "$lawyerDetails.name",
                        email: "$lawyerDetails.email",
                        mobile: "$lawyerDetails.mobile",
                        userId: "$lawyerDetails.user_id",
                        profileImage: "$lawyerDetails.profile_image",
                        dob: "$lawyerDetails.dob",
                        gender: "$lawyerDetails.gender",
                    },
                    caseTypeDetails: {
                        id: "$caseTypeDetails._id",
                        name: "$caseTypeDetails.name",
                    },
                    summary: "$summary",
                    estimatedValue: "$estimatedValue",
                    nextHearing: "$nextHearing",
                    status: "$status",
                    createdAt: "$createdAt",
                    updatedAt: "$updatedAt",
                },
            },
        ]);
        return data[0];
    }
    async findByCaseTypes(payload) {
        const data = await this.model.find({
            clientId: payload.userId,
            caseType: { $in: payload.caseTypeIds },
        });
        return data && this.mapper.toDomainArray
            ? this.mapper.toDomainArray(data)
            : [];
    }
    async findAllByUser(userId) {
        const data = await this.model.find({
            $or: [{ clientId: userId }, { lawyerId: userId }],
        });
        return data && this.mapper.toDomainArray
            ? this.mapper.toDomainArray(data)
            : [];
    }
    async countOpen() {
        return await this.model.countDocuments({ status: "open" });
    }
    async getCaseTrends(startDate, endDate) {
        const results = await this.model.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" },
                    },
                    cases: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: {
                        $dateFromParts: {
                            year: "$_id.year",
                            month: "$_id.month",
                            day: "$_id.day",
                        },
                    },
                    cases: 1,
                },
            },
            { $sort: { date: 1 } },
        ]);
        return results.map((r) => ({
            date: r.date.toISOString().split("T")[0],
            cases: r.cases,
        }));
    }
    async update(caseId, data) {
        const updated = await this.model.findOneAndUpdate({ _id: caseId }, data, { new: true });
        return updated ? this.mapper.toDomain(updated) : null;
    }
}
exports.CaseRepository = CaseRepository;
