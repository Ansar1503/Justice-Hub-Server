"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchBlogsByLawyerComposer = FetchBlogsByLawyerComposer;
const BlogMapper_1 = require("@infrastructure/Mapper/Implementations/BlogMapper");
const BlogRepo_1 = require("@infrastructure/database/repo/BlogRepo");
const FetchBlogsByLawyerController_1 = require("@interfaces/controller/Blog/FetchBlogsByLawyerController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FetchBlogsByLawyerUsecase_1 = require("@src/application/usecases/Blog/implements/FetchBlogsByLawyerUsecase");
function FetchBlogsByLawyerComposer() {
    const usecase = new FetchBlogsByLawyerUsecase_1.FetchBlogsByLawyerUsecase(new BlogRepo_1.BlogRepo(new BlogMapper_1.BlogMapper()));
    return new FetchBlogsByLawyerController_1.FetchBlogsByLawyerController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
