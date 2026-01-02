"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePracticeAreaComposer = DeletePracticeAreaComposer;
const PracticeAreaRepo_1 = require("@infrastructure/database/repo/PracticeAreaRepo");
const PracticeAreaMapper_1 = require("@infrastructure/Mapper/Implementations/PracticeAreaMapper");
const DeletePracticeAreaController_1 = require("@interfaces/controller/PracticeArea/DeletePracticeAreaController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const DeletePracticeAreaUsecase_1 = require("@src/application/usecases/PracitceAreas/Implementation/DeletePracticeAreaUsecase");
function DeletePracticeAreaComposer() {
    const usecase = new DeletePracticeAreaUsecase_1.DeletePracticeAreaUsecase(new PracticeAreaRepo_1.PracticeAreaRepo(new PracticeAreaMapper_1.PracticeAreaMapper()));
    return new DeletePracticeAreaController_1.DeletePracticeAreaController(usecase, new HttpSuccess_1.HttpSuccess(), new HttpErrors_1.HttpErrors());
}
