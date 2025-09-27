import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IController } from "../Interface/IController";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { ILoginUserUseCase } from "@src/application/usecases/Auth/ILoginUserUseCase";

export class LoginController implements IController {
    constructor(
    private loginUseCase: ILoginUserUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        const { email, password } = httpRequest.body as Record<string, any>;
        if (!email || !password) {
            const err = this.httpErrors.error_400();
            return new HttpResponse(err.statusCode, err.body);
        }
        try {
            const responsedata = await this.loginUseCase.execute({
                email: email.toLowerCase(),
                password,
            });
            const success = this.httpSuccess.success_200(responsedata);
            return new HttpResponse(success.statusCode, success.body);
        } catch (error) {
            console.log("error occured during login : ---- ", error);
            if (error instanceof Error) {
                return this.httpErrors.error_400(error.message);
            }
            const err = this.httpErrors.error_500();
            return new HttpResponse(err.statusCode, err.body);
        }
    }
}
