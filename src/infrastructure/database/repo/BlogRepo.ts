import { IBlogRepo } from "@domain/IRepository/IBlogRepo";
import { BaseRepository } from "./base/BaseRepo";
import { Blog } from "@domain/entities/BlogEntity";
import { BlogModel, IBlogModel } from "../model/BlogModel";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import { ClientSession, PipelineStage } from "mongoose";
import {
  BaseBlogDto,
  FetchBlogsByClientType,
  FetchBlogsByLawyerQueryDto,
  FetchBlogsByLawyerResponseDto,
  FetchedBlogByClient,
  UpdateBlogDto,
  infiniteFetchBlogsByClient,
} from "@src/application/dtos/Blog/BlogDto";

export class BlogRepo
  extends BaseRepository<Blog, IBlogModel>
  implements IBlogRepo
{
  constructor(mapper: IMapper<Blog, IBlogModel>, session?: ClientSession) {
    super(BlogModel, mapper, session);
  }

  async findById(blogId: string): Promise<Blog | null> {
    const blogDoc = await BlogModel.findById(blogId);
    return blogDoc ? this.mapper.toDomain(blogDoc) : null;
  }

  async update(blogId: string, update: UpdateBlogDto): Promise<Blog | null> {
    const data = await this.model.findOneAndUpdate({ _id: blogId }, update, {
      new: true,
    });
    return data ? this.mapper.toDomain(data) : null;
  }

  async addComment(
    blogId: string,
    userId: string,
    comment: string
  ): Promise<Blog | null> {
    return await BlogModel.findOneAndUpdate(
      { _id: blogId },
      {
        $push: {
          comments: {
            userId,
            comment,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );
  }

  async toggleLike(
    blogId: string,
    userId: string,
    like: boolean
  ): Promise<Blog | null> {
    if (like) {
      return await BlogModel.findOneAndUpdate(
        { _id: blogId },
        {
          $pull: { likes: userId },
        },
        { new: true }
      );
    } else {
      return await BlogModel.findOneAndUpdate(
        { _id: blogId },
        {
          $addToSet: { likes: userId },
        },
        { new: true }
      );
    }
  }

  async delete(blogId: string): Promise<void> {
    await this.model.findOneAndDelete({ _id: blogId });
  }
  async findByLawyerAndTitle(
    title: string,
    lawyerId: string
  ): Promise<Blog | null> {
    const blogDoc = await BlogModel.findOne({
      lawyerId,
      title: { $regex: new RegExp(`^${title}$`, "i") },
    });

    return blogDoc ? this.mapper.toDomain(blogDoc) : null;
  }
  async findByLawyer(
    payload: FetchBlogsByLawyerQueryDto
  ): Promise<FetchBlogsByLawyerResponseDto> {
    const { filter, lawyerId, limit, page, search, sort } = payload;

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 10);
    const skip = (pageNum - 1) * limitNum;

    const matchConditions: any[] = [{ lawyerId }];

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
    let sortStage: Record<string, 1 | -1> = { createdAt: -1 };
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

    const pipeline: PipelineStage[] = [
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

    const data: BaseBlogDto[] = docs.map((d: any) => ({
      id: String(d._id),
      lawyerId: d.lawyerId,
      title: d.title,
      content: d.content,
      coverImage: d.coverImage,
      isPublished: !!d.isPublished,
      likes: Array.isArray(d.likes) ? d.likes.map(String) : [],
      comments: Array.isArray(d.comments)
        ? d.comments.map((c: any) => ({
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

  async togglePublishStatus(
    blogId: string,
    toggle: boolean
  ): Promise<Blog | null> {
    const data = await this.model.findOneAndUpdate(
      { _id: blogId },
      { $set: { isPublished: toggle } },
      { new: true }
    );
    return data ? this.mapper.toDomain(data) : null;
  }

  async aggregateAll(
    payload: FetchBlogsByClientType
  ): Promise<infiniteFetchBlogsByClient> {
    const { search, sortBy } = payload;
    const cursor = payload.cursor ?? 1;
    const limit = 5;
    const skip = (cursor - 1) * limit;

    const regex = search.trim()
      ? { $regex: search.trim(), $options: "i" }
      : undefined;

    let sortStage: Record<string, 1 | -1> = { createdAt: -1 };
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

    const pipeline: PipelineStage[] = [
      {
        $match: {
          isPublished: true,
          ...(regex ? { $or: [{ title: regex }, { content: regex }] } : {}),
        },
      },
      {
        $addFields: {
          likesCount: { $size: { $ifNull: ["$likes", []] } },
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
        $unwind: {
          path: "$comments",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "comments.userId",
          foreignField: "user_id",
          as: "commentUser",
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "comments.userId",
          foreignField: "user_id",
          as: "commentClient",
        },
      },
      {
        $addFields: {
          "comments.user": {
            $cond: [
              { $gt: [{ $size: "$commentClient" }, 0] },
              {
                userId: { $arrayElemAt: ["$commentClient.user_id", 0] },
                name: { $arrayElemAt: ["$commentUser.name", 0] },
                profile_image: {
                  $let: {
                    vars: {
                      img: {
                        $arrayElemAt: ["$commentClient.profile_image", 0],
                      },
                    },
                    in: { $cond: [{ $eq: ["$$img", ""] }, null, "$$img"] },
                  },
                },
                comment: "$comments.comment",
                createdAt: "$comments.createdAt",
              },
              {
                userId: { $arrayElemAt: ["$commentUser.user_id", 0] },
                name: { $arrayElemAt: ["$commentUser.name", 0] },
                profile_image: null,
                comment: "$comments.comment",
                createdAt: "$comments.createdAt",
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          content: { $first: "$content" },
          coverImage: { $first: "$coverImage" },
          isPublished: { $first: "$isPublished" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          lawyerUser: { $first: "$lawyerUser" },
          lawyerClient: { $first: "$lawyerClient" },
          likeUsers: { $first: "$likeUsers" },
          likeClients: { $first: "$likeClients" },
          comments: { $push: "$comments.user" },
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
            profile_image: {
              $ifNull: ["$lawyerClient.profile_image", ""],
            },
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
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: "$likeClients",
                                as: "lc",
                                cond: {
                                  $eq: ["$$lc.user_id", "$$likeUser.user_id"],
                                },
                              },
                            },
                            0,
                          ],
                        },
                      },
                    },
                    "",
                  ],
                },
              },
            },
          },

          comments: {
            $filter: {
              input: "$comments",
              as: "c",
              cond: { $ne: ["$$c", null] },
            },
          },
        },
      },
    ];

    const aggResult = await this.model.aggregate(pipeline);

    const hasMore = aggResult.length === limit;
    const nextCursor = hasMore ? cursor + 1 : undefined;

    return { data: aggResult, nextCursor };
  }
  async getBlogById(blogId: string): Promise<FetchedBlogByClient | null> {
    const pipeline: PipelineStage[] = [
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
      { $unwind: { path: "$comments", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "users",
          localField: "comments.userId",
          foreignField: "user_id",
          as: "commentUser",
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "comments.userId",
          foreignField: "user_id",
          as: "commentClient",
        },
      },
      {
        $addFields: {
          "comments.user": {
            $cond: [
              { $gt: [{ $size: "$commentClient" }, 0] },
              {
                userId: { $arrayElemAt: ["$commentClient.user_id", 0] },
                name: { $arrayElemAt: ["$commentUser.name", 0] },
                profile_image: {
                  $let: {
                    vars: {
                      img: {
                        $arrayElemAt: ["$commentClient.profile_image", 0],
                      },
                    },
                    in: { $cond: [{ $eq: ["$$img", ""] }, null, "$$img"] },
                  },
                },
                comment: "$comments.comment",
                createdAt: "$comments.createdAt",
              },
              {
                userId: { $arrayElemAt: ["$commentUser.user_id", 0] },
                name: { $arrayElemAt: ["$commentUser.name", 0] },
                profile_image: null,
                comment: "$comments.comment",
                createdAt: "$comments.createdAt",
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          content: { $first: "$content" },
          coverImage: { $first: "$coverImage" },
          isPublished: { $first: "$isPublished" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          lawyerUser: { $first: "$lawyerUser" },
          lawyerClient: { $first: "$lawyerClient" },
          likeUsers: { $first: "$likeUsers" },
          likeClients: { $first: "$likeClients" },
          comments: { $push: "$comments.user" },
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
            profile_image: {
              $ifNull: ["$lawyerClient.profile_image", null],
            },
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
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: "$likeClients",
                                as: "lc",
                                cond: {
                                  $eq: ["$$lc.user_id", "$$usr.user_id"],
                                },
                              },
                            },
                            0,
                          ],
                        },
                      },
                    },
                    null,
                  ],
                },
              },
            },
          },

          comments: {
            $filter: {
              input: "$comments",
              as: "c",
              cond: { $ne: ["$$c", null] },
            },
          },
        },
      },
    ];

    const result = await this.model.aggregate(pipeline);
    return result[0] || null;
  }

  async getRelatedBlogs(blogId: string): Promise<FetchedBlogByClient[]> {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          isPublished: true,
          _id: { $ne: blogId },
        },
      },

      { $sort: { createdAt: -1 } },
      { $limit: 4 },
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
