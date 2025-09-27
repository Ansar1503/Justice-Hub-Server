import { IController } from "../Interface/IController";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IGetLawyerDetailUseCase } from "@src/application/usecases/Client/IGetLawyerDetailUseCase";

export class GetLawyerDetailController implements IController {
    constructor(
    private getLawyerDetails: IGetLawyerDetailUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
    ) {}

    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        if (
            httpRequest.params &&
      typeof httpRequest.params === "object" &&
      "id" in httpRequest.params
        ) {
            const { id } = httpRequest.params as { id: string };

            try {
                const response = await this.getLawyerDetails.execute(id);

                return new HttpResponse(200, {
                    success: true,
                    message: "lawyer data fetch successful",
                    data: response || {},
                });
            } catch (error: any) {
                switch (error.message) {
                case "USER_NOT_FOUND":
                    return new HttpResponse(404, {
                        success: false,
                        message: "lawyer not found",
                    });
                case "USER_BLOCKED":
                    return new HttpResponse(400, {
                        success: false,
                        message: "Lawyer is blocked",
                    });
                case "LAWYER_UNAVAILABLE":
                    return new HttpResponse(404, {
                        success: false,
                        message: "lawyer is unavailable at the moment",
                    });
                case "LAWYER_UNVERIFIED":
                    return new HttpResponse(400, {
                        success: false,
                        message: "lawyer is not verified",
                    });
                default:
                    return new HttpResponse(500, {
                        success: false,
                        message: "Internal Server Error",
                    });
                }
            }
        }

        return new HttpResponse(400, {
            success: false,
            message: "invalid credentials",
        });
    }
}
