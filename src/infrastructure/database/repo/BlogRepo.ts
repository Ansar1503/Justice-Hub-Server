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
    super(BlogModel, mapper);
  }
}
