import { ICaseRepo } from "@domain/IRepository/ICaseRepo";
import { BaseRepository } from "./base/BaseRepo";
import { Case } from "@domain/entities/Case";
import { CaseModel, ICaseModel } from "../model/CaseModel";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import { ClientSession } from "mongoose";
import {
    AggregatedCasesData,
    FetchCaseQueryType,
    FindCasesWithPagination,
} from "@src/application/dtos/Cases/FindCasesByQueryDto";

export class CaseRepository
    extends BaseRepository<Case, ICaseModel>
    implements ICaseRepo
{
    constructor(mapper: IMapper<Case, ICaseModel>, session?: ClientSession) {
        super(CaseModel, mapper, session);
    }
    async findByQuery(
        payload: FetchCaseQueryType
    ): Promise<FindCasesWithPagination> {
        const {
            limit,
            page,
            search,
            sortBy,
            sortOrder,
            userId,
            caseTypeFilter,
            status,
        } = payload;
        const skip = (page - 1) * limit;
        const order = sortOrder === "asc" ? 1 : -1;

        const matchStage1: Record<string, any> = {
            $and: [{ $or: [{ clientId: userId }, { lawyerId: userId }] }],
        };
        const matchStage2: Record<string, any> = {};
        const sortStage: Record<string, any> = {};

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
    async findById(id: string): Promise<AggregatedCasesData | null> {
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
}
