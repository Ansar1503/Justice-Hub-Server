"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMessages = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
class GetMessages {
    chatUseCase;
    httpErrors;
    httpSuccess;
    constructor(chatUseCase, httpErrors = new HttpErrors_1.HttpErrors(), httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this.chatUseCase = chatUseCase;
        this.httpErrors = httpErrors;
        this.httpSuccess = httpSuccess;
    }
    async handle(httpRequest) {
        try {
            const { cursor, sId } = httpRequest.query;
            const result = await this.chatUseCase.fetchChatMessages({
                page: Number(cursor),
                session_id: String(sId),
            });
            return this.httpSuccess.success_200(result);
        }
        catch (error) {
            return this.httpErrors.error_500();
        }
    }
}
exports.GetMessages = GetMessages;
