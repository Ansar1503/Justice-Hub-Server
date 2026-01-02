"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchBlogsByClientComposer = FetchBlogsByClientComposer;
const BlogMapper_1 = require("@infrastructure/Mapper/Implementations/BlogMapper");
const BlogRepo_1 = require("@infrastructure/database/repo/BlogRepo");
const FetchBlogsByClientController_1 = require("@interfaces/controller/Blog/FetchBlogsByClientController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FetchBlogsByClientUsecase_1 = require("@src/application/usecases/Blog/implements/FetchBlogsByClientUsecase");
function FetchBlogsByClientComposer() {
    const usecase = new FetchBlogsByClientUsecase_1.FetchBlogsByClientUsecase(new BlogRepo_1.BlogRepo(new BlogMapper_1.BlogMapper()));
    return new FetchBlogsByClientController_1.FetchBlogsByClientController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
