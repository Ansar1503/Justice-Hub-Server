import { IBlogRepo } from "@domain/IRepository/IBlogRepo";
import { BaseRepository } from "./base/BaseRepo";
import { Blog } from "@domain/entities/BlogEntity";
import { BlogModel, IBlogModel } from "../model/BlogModel";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import { ClientSession } from "mongoose";

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
}
