"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthComposer = GoogleAuthComposer;
const UnitofWork_1 = require("@infrastructure/database/UnitofWork/implementations/UnitofWork");
const GoogleAuthProvider_1 = require("@infrastructure/Providers/GoogleAuthProvider");
const JwtProvider_1 = require("@infrastructure/Providers/JwtProvider");
const GoogleAuthController_1 = require("@interfaces/controller/Auth/GoogleAuthController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const GoogleAuthUsecase_1 = require("@src/application/usecases/Auth/implementation/GoogleAuthUsecase");
function GoogleAuthComposer() {
    const usecase = new GoogleAuthUsecase_1.GoogleAuthUsecase(new GoogleAuthProvider_1.GoogleAuthProvider(), new JwtProvider_1.JwtProvider(), new UnitofWork_1.MongoUnitofWork());
    return new GoogleAuthController_1.GoogleAuthController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
