"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRepo = void 0;
const BaseRepo_1 = require("./base/BaseRepo");
const BlogModel_1 = require("../model/BlogModel");
class BlogRepo extends BaseRepo_1.BaseRepository {
    constructor(mapper, session) {
        super(BlogModel_1.BlogModel, mapper, session);
    }
    async findById(blogId) {
        const blogDoc = await BlogModel_1.BlogModel.findById(blogId);
        return blogDoc ? this.mapper.toDomain(blogDoc) : null;
    }
    async update(blogId, update) {
        const data = await this.model.findOneAndUpdate({ _id: blogId }, update, {
            new: true,
        });
        return data ? this.mapper.toDomain(data) : null;
    }
    async addComment(blogId, userId, comment) {
        return await BlogModel_1.BlogModel.findOneAndUpdate({ _id: blogId }, {
            $push: {
                comments: {
                    userId,
                    comment,
                    createdAt: new Date(),
                },
            },
        }, { new: true });
    }
    async toggleLike(blogId, userId, like) {
        if (!like) {
            return await BlogModel_1.BlogModel.findOneAndUpdate({ _id: blogId }, {
                $pull: { likes: userId },
            }, { new: true });
        }
        else {
            return await BlogModel_1.BlogModel.findOneAndUpdate({ _id: blogId }, {
                $addToSet: { likes: userId },
            }, { new: true });
        }
    }
    async delete(blogId) {
        await this.model.findOneAndDelete({ _id: blogId });
    }
    async findByLawyerAndTitle(title, lawyerId) {
        const blogDoc = await BlogModel_1.BlogModel.findOne({
            lawyerId,
            title: { $regex: new RegExp(`^${title}$`, "i") },
        });
        return blogDoc ? this.mapper.toDomain(blogDoc) : null;
    }
    async findByLawyer(payload) {
        const { filter, lawyerId, limit, page, search, sort } = payload;
        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Math.max(1, Number(limit) || 10);
        const skip = (pageNum - 1) * limitNum;
        const matchConditions = [{ lawyerId }];
        if (filter && filter !== "all") {
            matchConditions.push({
                isPublished: filter === "draft" ? false : true,
            });
        }
        if (search && search.trim()) {
            const regex = { $regex: search.trim(), $options: "i" };
            matchConditions.push({ $or: [{ title: regex }, { content: regex }] });
        }
        const matchStage = { $and: matchConditions };
        let sortStage = { createdAt: -1 };
        switch (sort) {
            case "oldest":
                sortStage = { createdAt: 1 };
                break;
            case "title-asc":
                sortStage = { title: 1 };
                break;
            case "title-desc":
                sortStage = { title: -1 };
                break;
            case "likes":
                sortStage = { likesCount: -1, createdAt: -1 };
                break;
            case "comments":
                sortStage = { commentsCount: -1, createdAt: -1 };
                break;
        }
        const pipeline = [
            { $match: matchStage },
            {
                $addFields: {
                    likesCount: { $size: { $ifNull: ["$likes", []] } },
                    commentsCount: { $size: { $ifNull: ["$comments", []] } },
                },
            },
            { $sort: sortStage },
            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: limitNum }],
                    totalCount: [{ $count: "count" }],
                },
            },
        ];
        const aggResult = await this.model.aggregate(pipeline).exec();
        const totalCount = aggResult?.[0]?.totalCount?.[0]?.count || 0;
        const docs = aggResult?.[0]?.data || [];
        const totalPage = Math.ceil(totalCount / limitNum);
        const data = docs.map((d) => ({
            id: String(d._id),
            lawyerId: d.lawyerId,
            title: d.title,
            content: d.content,
            coverImage: d.coverImage,
            isPublished: !!d.isPublished,
            likes: Array.isArray(d.likes) ? d.likes.map(String) : [],
            comments: Array.isArray(d.comments)
                ? d.comments.map((c) => ({
                    userId: String(c.userId),
                    comment: c.comment,
                    createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
                }))
                : [],
            createdAt: d.createdAt ? new Date(d.createdAt) : new Date(),
            updatedAt: d.updatedAt ? new Date(d.updatedAt) : new Date(),
        }));
        return {
            totalCount,
            currentPage: pageNum,
            totalPage,
            data,
        };
    }
    async togglePublishStatus(blogId, toggle) {
        const data = await this.model.findOneAndUpdate({ _id: blogId }, { $set: { isPublished: toggle } }, { new: true });
        return data ? this.mapper.toDomain(data) : null;
    }
    async aggregateAll(payload) {
        const { search, sortBy } = payload;
        const cursor = payload.cursor ?? 1;
        const limit = 5;
        const skip = (cursor - 1) * limit;
        const regex = search.trim()
            ? { $regex: search.trim(), $options: "i" }
            : undefined;
        let sortStage;
        switch (sortBy) {
            case "most-commented":
                sortStage = { commentsCount: -1, updatedAt: -1 };
                break;
            case "most-liked":
                sortStage = { likesCount: -1, updatedAt: -1 };
                break;
            case "newest":
            default:
                sortStage = { updatedAt: -1 };
                break;
        }
        const pipeline = [
            {
                $match: {
                    isPublished: true,
                    ...(regex ? { $or: [{ title: regex }, { content: regex }] } : {}),
                },
            },
            {
                $addFields: {
                    likesCount: { $size: { $ifNull: ["$likes", []] } },
                    comments: { $ifNull: ["$comments", []] },
                    commentsCount: { $size: { $ifNull: ["$comments", []] } },
                },
            },
            { $sort: sortStage },
            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: limit }],
                    totalCount: [{ $count: "count" }],
                },
            },
            { $unwind: { path: "$totalCount", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    data: 1,
                    totalCount: { $ifNull: ["$totalCount.count", 0] },
                },
            },
            { $unwind: "$data" },
            { $replaceRoot: { newRoot: "$data" } },
            {
                $lookup: {
                    from: "users",
                    localField: "lawyerId",
                    foreignField: "user_id",
                    as: "lawyerUser",
                },
            },
            { $unwind: { path: "$lawyerUser", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "clients",
                    localField: "lawyerUser.user_id",
                    foreignField: "user_id",
                    as: "lawyerClient",
                },
            },
            { $unwind: { path: "$lawyerClient", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "users",
                    localField: "likes",
                    foreignField: "user_id",
                    as: "likeUsers",
                },
            },
            {
                $lookup: {
                    from: "clients",
                    localField: "likes",
                    foreignField: "user_id",
                    as: "likeClients",
                },
            },
            {
                $lookup: {
                    from: "users",
                    let: { commenterIds: "$comments.userId" },
                    pipeline: [
                        { $match: { $expr: { $in: ["$user_id", "$$commenterIds"] } } },
                        { $project: { _id: 0, user_id: 1, name: 1 } },
                    ],
                    as: "commentUsers",
                },
            },
            {
                $lookup: {
                    from: "clients",
                    let: { commenterIds: "$comments.userId" },
                    pipeline: [
                        { $match: { $expr: { $in: ["$user_id", "$$commenterIds"] } } },
                        { $project: { _id: 0, user_id: 1, profile_image: 1 } },
                    ],
                    as: "commentClients",
                },
            },
            {
                $addFields: {
                    comments: {
                        $map: {
                            input: { $ifNull: ["$comments", []] },
                            as: "c",
                            in: {
                                userId: "$$c.userId",
                                comment: "$$c.comment",
                                createdAt: "$$c.createdAt",
                                name: {
                                    $let: {
                                        vars: {
                                            u: {
                                                $first: {
                                                    $filter: {
                                                        input: "$commentUsers",
                                                        as: "u",
                                                        cond: { $eq: ["$$u.user_id", "$$c.userId"] },
                                                    },
                                                },
                                            },
                                        },
                                        in: "$$u.name",
                                    },
                                },
                                profile_image: {
                                    $let: {
                                        vars: {
                                            cl: {
                                                $first: {
                                                    $filter: {
                                                        input: "$commentClients",
                                                        as: "cl",
                                                        cond: { $eq: ["$$cl.user_id", "$$c.userId"] },
                                                    },
                                                },
                                            },
                                        },
                                        in: {
                                            $cond: [
                                                {
                                                    $or: [
                                                        { $eq: ["$$cl.profile_image", ""] },
                                                        { $eq: ["$$cl.profile_image", null] },
                                                    ],
                                                },
                                                null,
                                                "$$cl.profile_image",
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            {
                $addFields: {
                    comments: {
                        $filter: {
                            input: "$comments",
                            as: "c",
                            cond: { $and: [{ $ne: ["$$c.userId", null] }] },
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    title: 1,
                    content: 1,
                    coverImage: 1,
                    isPublished: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    lawyerDetails: {
                        name: "$lawyerUser.name",
                        profile_image: { $ifNull: ["$lawyerClient.profile_image", ""] },
                    },
                    likes: {
                        $map: {
                            input: "$likeUsers",
                            as: "likeUser",
                            in: {
                                userId: "$$likeUser.user_id",
                                name: "$$likeUser.name",
                                profile_image: {
                                    $ifNull: [
                                        {
                                            $getField: {
                                                field: "profile_image",
                                                input: {
                                                    $first: {
                                                        $filter: {
                                                            input: "$likeClients",
                                                            as: "lc",
                                                            cond: {
                                                                $eq: ["$$lc.user_id", "$$likeUser.user_id"],
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        "",
                                    ],
                                },
                            },
                        },
                    },
                    comments: { $ifNull: ["$comments", []] },
                },
            },
        ];
        const aggResult = await this.model.aggregate(pipeline);
        const hasMore = aggResult.length === limit;
        const nextCursor = hasMore ? cursor + 1 : undefined;
        return { data: aggResult, nextCursor };
    }
    async getBlogById(blogId) {
        const pipeline = [
            { $match: { _id: blogId, isPublished: true } },
            {
                $addFields: {
                    likesCount: { $size: { $ifNull: ["$likes", []] } },
                    comments: { $ifNull: ["$comments", []] },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "lawyerId",
                    foreignField: "user_id",
                    as: "lawyerUser",
                },
            },
            { $unwind: { path: "$lawyerUser", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "clients",
                    localField: "lawyerUser.user_id",
                    foreignField: "user_id",
                    as: "lawyerClient",
                },
            },
            { $unwind: { path: "$lawyerClient", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "users",
                    localField: "likes",
                    foreignField: "user_id",
                    as: "likeUsers",
                },
            },
            {
                $lookup: {
                    from: "clients",
                    localField: "likes",
                    foreignField: "user_id",
                    as: "likeClients",
                },
            },
            {
                $lookup: {
                    from: "users",
                    let: { commenterIds: "$comments.userId" },
                    pipeline: [
                        { $match: { $expr: { $in: ["$user_id", "$$commenterIds"] } } },
                        { $project: { _id: 0, user_id: 1, name: 1 } },
                    ],
                    as: "commentUsers",
                },
            },
            {
                $lookup: {
                    from: "clients",
                    let: { commenterIds: "$comments.userId" },
                    pipeline: [
                        { $match: { $expr: { $in: ["$user_id", "$$commenterIds"] } } },
                        { $project: { _id: 0, user_id: 1, profile_image: 1 } },
                    ],
                    as: "commentClients",
                },
            },
            {
                $addFields: {
                    comments: {
                        $map: {
                            input: { $ifNull: ["$comments", []] },
                            as: "c",
                            in: {
                                userId: "$$c.userId",
                                comment: "$$c.comment",
                                createdAt: "$$c.createdAt",
                                name: {
                                    $let: {
                                        vars: {
                                            u: {
                                                $first: {
                                                    $filter: {
                                                        input: "$commentUsers",
                                                        as: "u",
                                                        cond: { $eq: ["$$u.user_id", "$$c.userId"] },
                                                    },
                                                },
                                            },
                                        },
                                        in: "$$u.name",
                                    },
                                },
                                profile_image: {
                                    $let: {
                                        vars: {
                                            cl: {
                                                $first: {
                                                    $filter: {
                                                        input: "$commentClients",
                                                        as: "cl",
                                                        cond: { $eq: ["$$cl.user_id", "$$c.userId"] },
                                                    },
                                                },
                                            },
                                        },
                                        in: {
                                            $cond: [
                                                {
                                                    $or: [
                                                        { $eq: ["$$cl.profile_image", ""] },
                                                        { $eq: ["$$cl.profile_image", null] },
                                                    ],
                                                },
                                                null,
                                                "$$cl.profile_image",
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            {
                $addFields: {
                    comments: {
                        $filter: {
                            input: "$comments",
                            as: "c",
                            cond: { $and: [{ $ne: ["$$c.userId", null] }] },
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    title: 1,
                    content: 1,
                    coverImage: 1,
                    isPublished: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    lawyerDetails: {
                        name: "$lawyerUser.name",
                        profile_image: { $ifNull: ["$lawyerClient.profile_image", null] },
                    },
                    likes: {
                        $map: {
                            input: "$likeUsers",
                            as: "usr",
                            in: {
                                userId: "$$usr.user_id",
                                name: "$$usr.name",
                                profile_image: {
                                    $ifNull: [
                                        {
                                            $getField: {
                                                field: "profile_image",
                                                input: {
                                                    $first: {
                                                        $filter: {
                                                            input: "$likeClients",
                                                            as: "lc",
                                                            cond: { $eq: ["$$lc.user_id", "$$usr.user_id"] },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        null,
                                    ],
                                },
                            },
                        },
                    },
                    comments: { $ifNull: ["$comments", []] },
                },
            },
        ];
        const result = await this.model.aggregate(pipeline);
        return result[0] || null;
    }
    async getRelatedBlogs(blogId) {
        const pipeline = [
            {
                $match: {
                    isPublished: true,
                    _id: { $ne: blogId },
                },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 3 },
            {
                $lookup: {
                    from: "users",
                    localField: "lawyerId",
                    foreignField: "user_id",
                    as: "lawyerUser",
                },
            },
            { $unwind: { path: "$lawyerUser", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "clients",
                    localField: "lawyerUser.user_id",
                    foreignField: "user_id",
                    as: "lawyerClient",
                },
            },
            { $unwind: { path: "$lawyerClient", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    title: 1,
                    content: 1,
                    coverImage: 1,
                    isPublished: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    lawyerDetails: {
                        name: "$lawyerUser.name",
                        profile_image: {
                            $ifNull: ["$lawyerClient.profile_image", ""],
                        },
                    },
                    likes: [],
                    comments: [],
                },
            },
        ];
        const result = await this.model.aggregate(pipeline);
        return result;
    }
}
exports.BlogRepo = BlogRepo;
