"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBlogComposer = CreateBlogComposer;
const BlogMapper_1 = require("@infrastructure/Mapper/Implementations/BlogMapper");
const BlogRepo_1 = require("@infrastructure/database/repo/BlogRepo");
const CreateBlogController_1 = require("@interfaces/controller/Blog/CreateBlogController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const CreateBlogUsecase_1 = require("@src/application/usecases/Blog/implements/CreateBlogUsecase");
function CreateBlogComposer() {
    const usecase = new CreateBlogUsecase_1.CreateBlogUsecase(new BlogRepo_1.BlogRepo(new BlogMapper_1.BlogMapper()));
    return new CreateBlogController_1.CreateBlogController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
