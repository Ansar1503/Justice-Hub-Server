
import { IController } from "../Interface/IController";
import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
import { IGetLawyersUseCase } from "@src/application/usecases/Client/IGetLawyerUseCase";

export class GetLawyersController implements IController {
  constructor(
    private getLawyerUsecase: IGetLawyersUseCase,
    private httpErrors: IHttpErrors = new HttpErrors(),
    private httpSuccess: IHttpSuccess = new HttpSuccess()
  ) {}
  async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
    const req = httpRequest as Record<string, any>;
    const {
      search = "",
      practiceAreas,
      specialisation,
      experienceMin = 0,
      experienceMax = 25,
      feeMin = 0,
      feeMax = 10000,
      sortBy = "experience",
      page = 1,
      limit = 10,
    } = req.query;

    const filters: any = {
      search: String(search),
      practiceAreas: practiceAreas
        ? Array.isArray(practiceAreas)
          ? practiceAreas.map(String)
          : [String(practiceAreas)]
        : undefined,
      specialisation: specialisation
        ? Array.isArray(specialisation)
          ? specialisation.map(String)
          : [String(specialisation)]
        : undefined,
      experienceMin: Number(experienceMin),
      experienceMax: Number(experienceMax),
      feeMin: Number(feeMin),
      feeMax: Number(feeMax),
      sortBy: String(sortBy) as any,
      page: Number(page),
      limit: Number(limit),
    };
    try {
      const lawyers = await this.getLawyerUsecase.execute(filters);
      const success = this.httpSuccess.success_200({
        success: true,
        message: "lawyers fetch success",
        data: lawyers,
      });
      return new HttpResponse(success.statusCode, success.body);
    } catch (error) {
      const err = this.httpErrors.error_500();
      return new HttpResponse(err.statusCode, err.body);
    }
  }
}
