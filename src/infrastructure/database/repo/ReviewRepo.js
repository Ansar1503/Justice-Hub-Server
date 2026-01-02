"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRepo = void 0;
const ReviewMapper_1 = require("@infrastructure/Mapper/Implementations/ReviewMapper");
const ReviewModel_1 = __importDefault(require("../model/ReviewModel"));
const ReviewModel_2 = __importDefault(require("../model/ReviewModel"));
class ReviewRepo {
    mappper;
    constructor(mappper = new ReviewMapper_1.ReviewMapper()) {
        this.mappper = mappper;
    }
    async create(payload) {
        const review = await new ReviewModel_2.default(this.mappper.toPersistence(payload)).save();
        return this.mappper.toDomain(review);
    }
    async update(payload) {
        const { heading, rating, review, active } = payload.updates;
        const update = {};
        if (heading) {
            update.heading = heading;
        }
        if (rating) {
            update.rating = rating;
        }
        if (review) {
            update.review = review;
        }
        if (active !== undefined && active !== null) {
            if (typeof active === "boolean") {
                update.active = active;
            }
        }
        const updatedData = await ReviewModel_1.default.findOneAndUpdate({ _id: payload.review_id }, update, { new: true });
        if (!updatedData)
            return null;
        return this.mappper.toDomain(updatedData);
    }
    async findBySession_id(session_id) {
        const result = await ReviewModel_1.default.aggregate([
            { $match: { active: true, session_id: session_id } },
            {
                $lookup: {
                    from: "users",
                    localField: "client_id",
                    foreignField: "user_id",
                    as: "clientUserData",
                },
            },
            {
                $unwind: { path: "$clientUserData", preserveNullAndEmptyArrays: true },
            },
            {
                $lookup: {
                    from: "clients",
                    localField: "client_id",
                    foreignField: "user_id",
                    as: "clientClientData",
                },
            },
            {
                $unwind: {
                    path: "$clientClientData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    reviewedBy: {
                        $mergeObjects: ["$clientUserData", "$clientClientData"],
                    },
                },
            },
            {
                $project: {
                    id: "$_id",
                    session_id: 1,
                    heading: 1,
                    review: 1,
                    rating: 1,
                    active: 1,
                    client_id: 1,
                    lawyer_id: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    reviewedBy: {
                        user_id: "$reviewedBy.user_id",
                        name: "$reviewedBy.name",
                        profile_image: "$reviewedBy.profile_image",
                    },
                },
            },
        ]);
        return result;
    }
    async findByLawyer_id(payload) {
        const { lawyer_id, page } = payload;
        const limit = 10;
        const skip = page > 0 ? Math.abs(page - 1) * limit : 0;
        const result = await ReviewModel_1.default.aggregate([
            { $match: { active: true, lawyer_id: lawyer_id } },
            {
                $lookup: {
                    from: "users",
                    localField: "client_id",
                    foreignField: "user_id",
                    as: "clientUserData",
                },
            },
            {
                $unwind: { path: "$clientUserData", preserveNullAndEmptyArrays: true },
            },
            {
                $lookup: {
                    from: "clients",
                    localField: "client_id",
                    foreignField: "user_id",
                    as: "clientClientData",
                },
            },
            {
                $unwind: {
                    path: "$clientClientData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    reviewedBy: {
                        $mergeObjects: ["$clientUserData", "$clientClientData"],
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    review: 1,
                    session_id: 1,
                    heading: 1,
                    rating: 1,
                    active: 1,
                    client_id: 1,
                    lawyer_id: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "reviewedBy.name": 1,
                    "reviewedBy.email": 1,
                    "reviewedBy.phone": 1,
                    "reviewedBy.profile_image": 1,
                },
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit + 1 },
        ]);
        const hasNextPage = result.length > limit;
        const data = hasNextPage ? result.slice(0, limit) : result;
        return {
            data: data.map((r) => ({
                client_id: r.client_id,
                id: r._id,
                createdAt: r.createdAt,
                heading: r.heading,
                rating: r.rating,
                review: r.review,
                active: r.active,
                reviewedBy: r.reviewedBy,
                session_id: r.session_id,
                lawyer_id: r.lawyer_id,
                updatedAt: r.updatedAt,
            })),
            nextCursor: hasNextPage ? page + 1 : undefined,
        };
    }
    async findByReview_id(id) {
        const data = await ReviewModel_1.default.findOne({ _id: id });
        return data ? this.mappper.toDomain(data) : null;
    }
    async findReviewsByUser_id(payload) {
        const { limit, page, role, search, sortBy, sortOrder, user_id } = payload;
        const order = sortOrder === "asc" ? 1 : -1;
        const skip = page > 0 ? Math.abs(page - 1) * limit : 0;
        const matchQuery = { active: true };
        const sortQuery = {};
        if (role === "client") {
            matchQuery["client_id"] = user_id;
        }
        else if (role === "lawyer") {
            matchQuery["lawyer_id"] = user_id;
        }
        if (search) {
            matchQuery.$or = [
                { heading: { $regex: search, $options: "i" } },
                { review: { $regex: search, $options: "i" } },
            ];
        }
        if (sortBy === "date") {
            sortQuery["createdAt"] = order;
        }
        else if (sortBy === "rating") {
            sortQuery["rating"] = order;
        }
        const lookups = [
            { $match: matchQuery },
            {
                $lookup: {
                    from: "users",
                    localField: "client_id",
                    foreignField: "user_id",
                    as: "clientUserData",
                },
            },
            {
                $unwind: { path: "$clientUserData", preserveNullAndEmptyArrays: true },
            },
            {
                $lookup: {
                    from: "clients",
                    localField: "client_id",
                    foreignField: "user_id",
                    as: "clientClientData",
                },
            },
            {
                $unwind: {
                    path: "$clientClientData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    reviewedBy: {
                        $mergeObjects: ["$clientUserData", "$clientClientData"],
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "lawyer_id",
                    foreignField: "user_id",
                    as: "lawyerUserData",
                },
            },
            {
                $unwind: { path: "$lawyerUserData", preserveNullAndEmptyArrays: true },
            },
            {
                $lookup: {
                    from: "clients",
                    localField: "lawyer_id",
                    foreignField: "user_id",
                    as: "lawyerClientData",
                },
            },
            {
                $unwind: {
                    path: "$lawyerClientData",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    reviewedFor: {
                        $mergeObjects: ["$lawyerUserData", "$lawyerClientData"],
                    },
                },
            },
        ];
        const dataPipeline = [...lookups];
        const countPipeline = [...lookups];
        dataPipeline.push({
            $project: {
                review: 1,
                _id: 1,
                session_id: 1,
                heading: 1,
                rating: 1,
                active: 1,
                client_id: 1,
                lawyer_id: 1,
                "reviewedBy.name": 1,
                "reviewedBy.profile_image": 1,
                "reviewedFor.name": 1,
                "reviewedFor.profile_image": 1,
                createdAt: 1,
                updatedAt: 1,
            },
        }, { $sort: sortQuery }, { $skip: skip }, { $limit: limit });
        countPipeline.push({ $count: "total" });
        const [data, count] = await Promise.all([
            ReviewModel_1.default.aggregate(dataPipeline),
            ReviewModel_1.default.aggregate(countPipeline),
        ]);
        const totalCount = count[0]?.total || 0;
        const totalPage = Math.ceil(totalCount / limit);
        return {
            data: data.map((d) => ({
                id: d?._id,
                heading: d?.heading,
                session_id: d?.session_id,
                rating: d?.rating,
                review: d?.review,
                active: d?.active,
                client_id: d?.client_id,
                lawyer_id: d?.lawyer_id,
                reviewedFor: d?.reviewedFor,
                reviewedBy: d?.reviewedBy,
                createdAt: d?.createdAt,
                updatedAt: d?.updatedAt,
            })),
            totalCount,
            currentPage: page,
            totalPage,
        };
    }
    async findByUserId(userId) {
        const data = await ReviewModel_1.default.find({
            $or: [{ client_id: userId }, { lawyer_id: userId }],
        });
        return data && this.mappper.toDomainArray
            ? this.mappper.toDomainArray(data)
            : [];
    }
}
exports.ReviewRepo = ReviewRepo;
