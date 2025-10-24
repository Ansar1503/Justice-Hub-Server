import { Blog } from "@domain/entities/BlogEntity";
import { IBaseRepository } from "./IBaseRepo";

export interface IBlogRepo extends IBaseRepository<Blog> {}
