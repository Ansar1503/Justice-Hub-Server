import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IRegiserUserUseCase } from "@src/application/usecases/Auth/IRegisterUserUseCase";
import { RegisterUserDto } from "@src/application/dtos/user.dto";
import { IController } from "../Interface/IController";

export class RegisterUser implements IController {
    constructor(
        private _registerUseCase: IRegiserUserUseCase,
        private _httpErrors: IHttpErrors = new HttpErrors(),
        private _httpSuccess: IHttpSuccess = new HttpSuccess(),
    ) {}

    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        if (!httpRequest.body || typeof httpRequest.body !== "object") {
            const err = this._httpErrors.error_400();
            return new HttpResponse(err.statusCode, err.body);
        }

        const payload: Partial<RegisterUserDto> = {};

        if (typeof httpRequest.body === "object" && httpRequest.body !== null) {
            if ("name" in httpRequest.body && typeof httpRequest.body.name === "string") {
                payload.name = httpRequest.body.name;
            }
            if ("email" in httpRequest.body && typeof httpRequest.body.email === "string") {
                payload.email = httpRequest.body.email;
            }
            if ("mobile" in httpRequest.body && typeof httpRequest.body.mobile === "string") {
                payload.mobile = httpRequest.body.mobile;
            }
            if ("role" in httpRequest.body) {
                if (httpRequest.body.role === "admin") {
                    payload.role = httpRequest.body.role;
                }
                if (httpRequest.body.role === "lawyer") {
                    payload.role = httpRequest.body.role;
                }
                if (httpRequest.body.role === "client") {
                    payload.role = httpRequest.body.role;
                }
            }
            if ("password" in httpRequest.body && typeof httpRequest.body.password === "string") {
                payload.password = httpRequest.body.password;
            }
        }
        try {
            if (!payload.email || !payload.mobile || !payload.name || !payload.password || !payload.role) {
                return this._httpErrors.error_400("Invalid Credentials");
            }
            const dto = new RegisterUserDto(payload as RegisterUserDto);

            const user = await this._registerUseCase.execute(dto);

            if (!user) {
                const err = this._httpErrors.error_500();
                return new HttpResponse(err.statusCode, {
                    message: "Error Registering User",
                });
            }

            const success = this._httpSuccess.success_201(user);
            return new HttpResponse(success.statusCode, success.body);
        } catch (error) {
            if (error instanceof Error) {
                return this._httpErrors.error_400(error.message);
            }
            return this._httpErrors.error_500("Error Registering User");
        }
    }
}
