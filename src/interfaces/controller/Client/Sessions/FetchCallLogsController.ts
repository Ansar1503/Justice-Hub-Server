// import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
// import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
// import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
// import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
// import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
// import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
// import { HttpResponse } from "@interfaces/helpers/implementation/HttpResponse";
// import { I_clientUsecase } from "@src/application/usecases/I_usecases/I_clientusecase";
// import { IController } from "@interfaces/controller/Interface/IController";

// export class FetchCallLogsController implements IController {
//   constructor(
//     private clientUseCase: I_clientUsecase,
//     private httpErrors: IHttpErrors = new HttpErrors(),
//     private httpSuccess: IHttpSuccess = new HttpSuccess()
//   ) {}

//   async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
//     try {
//       const sessionId =
//         httpRequest.params &&
//         typeof httpRequest.params === "object" &&
//         "id" in httpRequest.params
//           ? (httpRequest.params as { id: string }).id
//           : undefined;

//       const query = (httpRequest.query || {}) as { limit?: string | number; page?: string | number };
//       const limit = !isNaN(Number(query.limit)) ? Number(query.limit) : 10;
//       const page = !isNaN(Number(query.page)) ? Number(query.page) : 1;

//       if (!sessionId) {
//         const error = this.httpErrors.error_400("sessionId is required");
//         return new HttpResponse(error.statusCode, error.body);
//       }

//       const result = await this.clientUseCase.fetchCallLogs({
//         sessionId,
//         limit,
//         page,
//       });

//       const success = this.httpSuccess.success_200(result);
//       return new HttpResponse(success.statusCode, success.body);
//     } catch (error) {
//       const err = this.httpErrors.error_500();
//       return new HttpResponse(err.statusCode, err.body);
//     }
//   }
// }
