import { IBlogRepo } from "@domain/IRepository/IBlogRepo";
import { BaseRepository } from "./base/BaseRepo";
import { Blog } from "@domain/entities/BlogEntity";
import { BlogModel, IBlogModel } from "../model/BlogModel";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import { ClientSession } from "mongoose";
import {
  BaseBlogDto,
  FetchBlogsByLawyerQueryDto,
  FetchBlogsByLawyerResponseDto,
  UpdateBlogDto,
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
    let sortStage: Record<string, number> = { createdAt: -1 };
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

    const pipeline: any[] = [
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
}
