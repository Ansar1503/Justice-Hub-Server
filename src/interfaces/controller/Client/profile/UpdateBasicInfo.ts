import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IUpdateClientDataUseCase } from "@src/application/usecases/Client/IUpdateClientDataUseCase";
import { IController } from "../../Interface/IController";

export class UpdateBasicInfoController implements IController {
    constructor(
        private _udpateClientData: IUpdateClientDataUseCase,
        private _errors: IHttpErrors = new HttpErrors(),
        private _success: IHttpSuccess = new HttpSuccess(),
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        const { name, mobile, dob, gender } = httpRequest.body as Record<string, any>;
        if (!name || !mobile) {
            const err = this._errors.error_400();
            return new HttpResponse(err.statusCode, err.body);
        }
        const profile_image = (httpRequest as Record<string, any>)?.file?.path
        const user_id = (httpRequest as Record<string, any>)?.user?.id;
        try {
            const updateData = await this._udpateClientData.execute({
                profile_image,
                user_id,
                name,
                mobile,
                dob,
                gender,
            });
            if (!updateData) {
                const err = this._errors.error_500();
                return new HttpResponse(err.statusCode, err.body);
            }
            const success = this._success.success_200(updateData);
            return new HttpResponse(success.statusCode, success.body);
        } catch (error) {
            if (error instanceof Error) {
                return this._errors.error_400(error.message);
            }
            return this._errors.error_500();
        }
    }
}
