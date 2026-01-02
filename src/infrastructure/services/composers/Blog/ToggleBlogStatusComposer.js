"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleBlogPublishComposer = ToggleBlogPublishComposer;
const BlogMapper_1 = require("@infrastructure/Mapper/Implementations/BlogMapper");
const BlogRepo_1 = require("@infrastructure/database/repo/BlogRepo");
const ToggleBlogStatusController_1 = require("@interfaces/controller/Blog/ToggleBlogStatusController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const ToggleBlogPublishUsecase_1 = require("@src/application/usecases/Blog/implements/ToggleBlogPublishUsecase");
function ToggleBlogPublishComposer() {
    const usecase = new ToggleBlogPublishUsecase_1.ToggleBlogPublishUsecase(new BlogRepo_1.BlogRepo(new BlogMapper_1.BlogMapper()));
    return new ToggleBlogStatusController_1.ToggleBlogStatusController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
