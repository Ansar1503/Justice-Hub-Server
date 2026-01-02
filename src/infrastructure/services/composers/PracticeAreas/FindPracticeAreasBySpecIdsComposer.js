"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindPracticeAreasBySpecIdsComposer = FindPracticeAreasBySpecIdsComposer;
const PracticeAreaRepo_1 = require("@infrastructure/database/repo/PracticeAreaRepo");
const PracticeAreaMapper_1 = require("@infrastructure/Mapper/Implementations/PracticeAreaMapper");
const FindPracticeAreasBySpecIds_1 = require("@interfaces/controller/PracticeArea/FindPracticeAreasBySpecIds");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FindPacticeAreasBySpecIdsUsecase_1 = require("@src/application/usecases/PracitceAreas/Implementation/FindPacticeAreasBySpecIdsUsecase");
function FindPracticeAreasBySpecIdsComposer() {
    const practiceAreaRepo = new PracticeAreaRepo_1.PracticeAreaRepo(new PracticeAreaMapper_1.PracticeAreaMapper());
    const usecase = new FindPacticeAreasBySpecIdsUsecase_1.FindPracticeAreasBySpecIdsUsecase(practiceAreaRepo);
    return new FindPracticeAreasBySpecIds_1.FindPracticeAreasBySpecIds(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
