"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeOrDislikeBlogComposer = LikeOrDislikeBlogComposer;
const BlogMapper_1 = require("@infrastructure/Mapper/Implementations/BlogMapper");
const BlogRepo_1 = require("@infrastructure/database/repo/BlogRepo");
const LikeOrDislikeBlogController_1 = require("@interfaces/controller/Blog/LikeOrDislikeBlogController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const LikeBlogUsecase_1 = require("@src/application/usecases/Blog/implements/LikeBlogUsecase");
function LikeOrDislikeBlogComposer() {
    const usecase = new LikeBlogUsecase_1.LikeOrDislikeBlogUsecase(new BlogRepo_1.BlogRepo(new BlogMapper_1.BlogMapper()));
    return new LikeOrDislikeBlogController_1.LikeOrDislikeBlogController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
