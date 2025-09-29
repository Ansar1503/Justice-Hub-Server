import { IFetchSessionUseCase } from "@src/application/usecases/Admin/IFetchSessionUseCase";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { zodSessionQuerySchema } from "@interfaces/middelwares/validator/zod/zod.validate";
import { IController } from "../Interface/IController";

export class FetchSessions implements IController {
    constructor(
        private fetchSessionUseCase: IFetchSessionUseCase,
        private httpSuccess: IHttpSuccess = new HttpSuccess(),
        private httpErrors: IHttpErrors = new HttpErrors(),
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        let user_id = "";
        if (
            httpRequest.user &&
            typeof httpRequest.user === "object" &&
            "id" in httpRequest.user &&
            typeof httpRequest.user.id === "string" &&
            "role" in httpRequest.user &&
            httpRequest.user.role !== "admin"
        ) {
            user_id = httpRequest.user.id;
        }
        const parsedData = zodSessionQuerySchema.safeParse(httpRequest.query);
        if (!parsedData.success) {
            const err = parsedData.error.errors[0];
            return this.httpErrors.error_400(err.message);
        }
        try {
            if (!parsedData.data) {
                return this.httpErrors.error_400("Invalid Credentials");
            }
            const result = await this.fetchSessionUseCase.execute({
                ...parsedData.data,
                user_id,
            });
            // console.log("result", result);
            const success = this.httpSuccess.success_200(result);
            return success;
        } catch (error) {
            // console.log("error:", error);
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            return this.httpErrors.error_500();
        }
    }
}
