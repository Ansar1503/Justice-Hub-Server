"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchPaymentsComposer = FetchPaymentsComposer;
const PaymentRepo_1 = require("@infrastructure/database/repo/PaymentRepo");
const PaymentsMapper_1 = require("@infrastructure/Mapper/Implementations/PaymentsMapper");
const FetchPaymentsController_1 = require("@interfaces/controller/Client/FetchPaymentsController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FetchPaymentsUsecase_1 = require("@src/application/usecases/Client/implementations/FetchPaymentsUsecase");
function FetchPaymentsComposer() {
    const usecase = new FetchPaymentsUsecase_1.FetchPaymentsUsecase(new PaymentRepo_1.PaymentRepo(new PaymentsMapper_1.PaymentMapper()));
    return new FetchPaymentsController_1.FetchPaymentsController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
