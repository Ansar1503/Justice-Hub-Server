"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchProfileImageComposer = FetchProfileImageComposer;
const ClientRepo_1 = require("@infrastructure/database/repo/ClientRepo");
const FetchProfileImage_1 = require("@interfaces/controller/Client/profile/FetchProfileImage");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const cloudinary_service_1 = require("@src/application/services/cloudinary.service");
const FetchProfileImageUsecase_1 = require("@src/application/usecases/Client/implementations/FetchProfileImageUsecase");
function FetchProfileImageComposer() {
    const usecase = new FetchProfileImageUsecase_1.FetchProfileImageUsecase(new ClientRepo_1.ClientRepository(), new cloudinary_service_1.CloudinaryService());
    return new FetchProfileImage_1.FetchProfileImageController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
