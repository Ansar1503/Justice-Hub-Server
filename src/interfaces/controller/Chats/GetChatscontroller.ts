import { IChatusecase } from "@src/application/usecases/IUseCases/IChatusecase";
import { IController } from "../Interface/IController";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";

export class GetChatsController implements IController {
    constructor(
    private readonly _chatUseCase: IChatusecase,
    private _httpErrors: IHttpErrors = new HttpErrors(),
    private _httpSuccess: IHttpSuccess = new HttpSuccess()
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        const { cursor, search } = httpRequest.query as {
      cursor?: string;
      search?: string;
    };
        const user = httpRequest.user as { id?: string; role?: string } | undefined;
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
        } catch (error) {
            console.log("error", error);
            if (error instanceof Error) {
                return this._httpErrors.error_400(error.message);
            }
            return this._httpErrors.error_500();
        }
    }
}
