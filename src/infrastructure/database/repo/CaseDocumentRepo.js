"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseDocumentRepo = void 0;
const BaseRepo_1 = require("./base/BaseRepo");
const CaseDocumentModel_1 = __importDefault(require("../model/CaseDocumentModel"));
class CaseDocumentRepo extends BaseRepo_1.BaseRepository {
    constructor(mapper) {
        super(CaseDocumentModel_1.default, mapper);
    }
    async findByCase(payload) {
        const { caseId, limit = 10, page = 1, search, sort = "date", uploadedBy, sortOrder = "desc", } = payload;
        const order = sortOrder === "asc" ? 1 : -1;
        const skip = (page - 1) * limit;
        const match = { caseId };
        if (search.trim())
            match["document.name"] = { $regex: search, $options: "i" };
        const sortQuery = {};
        switch (sort) {
            case "date":
                sortQuery.createdAt = order;
                break;
            case "name":
                sortQuery["document.name"] = order;
                break;
            case "size":
                sortQuery["document.size"] = order;
                break;
            default:
                sortQuery.createdAt = order;
        }
        const pipeline = [
            { $match: match },
            {
                $lookup: {
                    from: "users",
                    localField: "uploadBy",
                    foreignField: "user_id",
                    as: "uploadedByUserDetails",
                },
            },
            {
                $unwind: {
                    path: "$uploadedByUserDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "clients",
                    localField: "uploadBy",
                    foreignField: "user_id",
                    as: "uploadedByClientDetails",
                },
            },
            {
                $unwind: {
                    path: "$uploadedByClientDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    uploaderDetails: {
                        $mergeObjects: [
                            { $ifNull: ["$uploadedByUserDetails", {}] },
                            { $ifNull: ["$uploadedByClientDetails", {}] },
                        ],
                    },
                },
            },
            {
                $match: {
                    "uploaderDetails.role": uploadedBy,
                },
            },
            {
                $project: {
                    id: "$_id",
                    caseId: 1,
                    document: {
                        name: "$document.name",
                        type: "$document.type",
                        url: "$document.url",
                        size: "$document.size",
                    },
                    createdAt: 1,
                    updatedAt: 1,
                    uploaderDetails: {
                        name: "$uploaderDetails.name",
                        email: "$uploaderDetails.email",
                        mobile: "$uploaderDetails.mobile",
                        user_id: "$uploaderDetails.user_id",
                        profile_image: "$uploaderDetails.profile_image",
                        role: "$uploaderDetails.role",
                        dob: "$uploaderDetails.dob",
                        gender: "$uploaderDetails.gender",
                    },
                },
            },
            { $sort: sortQuery },
            { $skip: skip },
            { $limit: limit },
        ];
        // console.log("pipeline", pipeline);
        const [data, totalCount] = await Promise.all([
            this.model.aggregate(pipeline),
            this.model.countDocuments(match),
        ]);
        return {
            totalCount,
            currentPage: page,
            totalPage: Math.ceil(totalCount / limit),
            data: data,
        };
    }
    async delete(id) {
        await this.model.findOneAndDelete({ _id: id });
    }
    async findById(id) {
        const data = await this.model.findOne({ _id: id });
        return data ? this.mapper.toDomain(data) : null;
    }
}
exports.CaseDocumentRepo = CaseDocumentRepo;
