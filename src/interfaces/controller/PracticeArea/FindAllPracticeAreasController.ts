import { IFindAllPracticeAreasUsecase } from "@src/application/usecases/PracitceAreas/IFindAllPracticeAreasUsecase";
import { IController } from "../Interface/IController";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { FindAllPracticeAreasQuery } from "@interfaces/middelwares/validator/zod/PracticeAreas/FindAllPracticeAreasQuery";

export class FindAllPracticeAreasController implements IController {
    constructor(
    private _findAllPracticeAreas: IFindAllPracticeAreasUsecase,
    private _httpSucces: IHttpSuccess,
    private _httpErrors: IHttpErrors
    ) {}
    async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
        const parsed = FindAllPracticeAreasQuery.safeParse(httpRequest.query);
        if (!parsed.success) {
            const er = parsed.error.errors[0];
            return this._httpErrors.error_400(er.message);
        }
        try {
            const result = await this._findAllPracticeAreas.execute(parsed.data);
            return this._httpSucces.success_200(result);
        } catch (error) {
            if (error instanceof Error) {
                return this._httpErrors.error_400(error.message);
            }
            return this._httpErrors.error_500();
        }
    }
}
