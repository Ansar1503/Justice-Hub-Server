"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteBlogComposer = DeleteBlogComposer;
const BlogMapper_1 = require("@infrastructure/Mapper/Implementations/BlogMapper");
const BlogRepo_1 = require("@infrastructure/database/repo/BlogRepo");
const DeleteBlogController_1 = require("@interfaces/controller/Blog/DeleteBlogController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const DeleteBlogUsecase_1 = require("@src/application/usecases/Blog/implements/DeleteBlogUsecase");
function DeleteBlogComposer() {
    const usecase = new DeleteBlogUsecase_1.DeleteBlogUsecase(new BlogRepo_1.BlogRepo(new BlogMapper_1.BlogMapper()));
    return new DeleteBlogController_1.DeleteBlogController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
