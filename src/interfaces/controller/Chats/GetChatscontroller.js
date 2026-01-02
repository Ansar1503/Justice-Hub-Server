"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetChatsController = void 0;
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
class GetChatsController {
    _chatUseCase;
    _httpErrors;
    _httpSuccess;
    constructor(_chatUseCase, _httpErrors = new HttpErrors_1.HttpErrors(), _httpSuccess = new HttpSuccess_1.HttpSuccess()) {
        this._chatUseCase = _chatUseCase;
        this._httpErrors = _httpErrors;
        this._httpSuccess = _httpSuccess;
    }
    async handle(httpRequest) {
        const { cursor, search } = httpRequest.query;
        const user = httpRequest.user;
        const user_id = user?.id;
        const role = user?.role === "lawyer" ? "lawyer" : "client";
        try {
            const result = await this._chatUseCase.fetchChats({
                page: Number(cursor),
                search: String(search),
                role: role,
                user_id: String(user_id),
            });
            return this._httpSuccess.success_200(result);
        }
        catch (error) {
            if (error instanceof Error) {
                return this._httpErrors.error_400(error.message);
            }
            return this._httpErrors.error_500();
        }
    }
}
exports.GetChatsController = GetChatsController;
