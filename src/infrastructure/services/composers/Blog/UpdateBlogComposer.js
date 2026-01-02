"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBlogComposer = UpdateBlogComposer;
const BlogMapper_1 = require("@infrastructure/Mapper/Implementations/BlogMapper");
const BlogRepo_1 = require("@infrastructure/database/repo/BlogRepo");
const UpdateBlogController_1 = require("@interfaces/controller/Blog/UpdateBlogController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const UpdateBlogUsecase_1 = require("@src/application/usecases/Blog/implements/UpdateBlogUsecase");
function UpdateBlogComposer() {
    const usecase = new UpdateBlogUsecase_1.UpdateBlogUsecase(new BlogRepo_1.BlogRepo(new BlogMapper_1.BlogMapper()));
    return new UpdateBlogController_1.UpdateBlogController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
