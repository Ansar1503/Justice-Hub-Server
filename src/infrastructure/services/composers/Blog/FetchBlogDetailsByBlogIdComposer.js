"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchBlogDetailsByBlogIdComposer = FetchBlogDetailsByBlogIdComposer;
const BlogMapper_1 = require("@infrastructure/Mapper/Implementations/BlogMapper");
const BlogRepo_1 = require("@infrastructure/database/repo/BlogRepo");
const FetchBlogDetailsByBlogIdController_1 = require("@interfaces/controller/Blog/FetchBlogDetailsByBlogIdController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FetchBlogDetailsByBlogIdUsecase_1 = require("@src/application/usecases/Blog/implements/FetchBlogDetailsByBlogIdUsecase");
function FetchBlogDetailsByBlogIdComposer() {
    const usecase = new FetchBlogDetailsByBlogIdUsecase_1.FetchBlogDetailsByBlogIdUsecase(new BlogRepo_1.BlogRepo(new BlogMapper_1.BlogMapper()));
    return new FetchBlogDetailsByBlogIdController_1.FetchBlogDetailsByBlogIdController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
