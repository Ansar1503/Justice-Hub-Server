// import { IController } from "@interfaces/controller/Interface/IController";
// import { IHttpErrors } from "@interfaces/helpers/IHttpErrors.";
// import { IHttpResponse } from "@interfaces/helpers/IHttpResponse";
// import { IHttpSuccess } from "@interfaces/helpers/IHttpSuccess";
// import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
// import { HttpRequest } from "@interfaces/helpers/implementation/HttpRequest";
// import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
// import { IFetchAppointmentDetailsLawyerUseCase } from "@src/application/usecases/Lawyer/IFetchAppointmentDetailsLawyerUseCase";

// export class FetchAppointmentsController implements IController {
//     constructor(
//         private _FetchAppointmentsLawyer: IFetchAppointmentDetailsLawyerUseCase,
//         private _httpSuccess: IHttpSuccess = new HttpSuccess(),
//         private _httpErrors: IHttpErrors = new HttpErrors(),
//     ) {}
//     async handle(httpRequest: HttpRequest): Promise<IHttpResponse> {
//         let user_id: string = "";
//         let search: string = "";
//         let appointmentStatus: appointmentstatustype = "all";
//         let sortField: sortFieldType = "date";
//         let sortOrder: "asc" | "desc" = "asc";
//         let appointmentType: "all" | "consultation" | "follow-up" = "all";
//         let page: number = 1;
//         let limit: number = 10;
//         if (httpRequest.user && typeof httpRequest.user === "object" && "id" in httpRequest.user) {
//             user_id = String(httpRequest.user.id);
//         }
//         if (!user_id) {
//             return this._httpErrors.error_400("User_id Not found");
//         }
//         if (httpRequest.query && typeof httpRequest.query === "object") {
//             if ("search" in httpRequest.query) {
//                 search = String(httpRequest.query.search);
//             }
//             if ("appointmentStatus" in httpRequest.query) {
//                 if (
//                     httpRequest.query.appointmentStatus === "confirmed" ||
//                     httpRequest.query.appointmentStatus === "pending" ||
//                     httpRequest.query.appointmentStatus === "completed" ||
//                     httpRequest.query.appointmentStatus === "cancelled" ||
//                     httpRequest.query.appointmentStatus === "rejected"
//                 ) {
//                     appointmentStatus = httpRequest.query.appointmentStatus;
//                 }
//             }
//             if ("sortField" in httpRequest.query) {
//                 if (
//                     httpRequest.query.sortField === "name" ||
//                     httpRequest.query.sortField === "date" ||
//                     httpRequest.query.sortField === "consultation_fee" ||
//                     httpRequest.query.sortField === "created_at"
//                 ) {
//                     sortField = httpRequest.query.sortField;
//                 }
//             }
//             if ("sortOrder" in httpRequest.query) {
//                 if (httpRequest.query.sortOrder === "asc" || httpRequest.query.sortOrder === "desc") {
//                     sortOrder = httpRequest.query.sortOrder;
//                 }
//             }
//             if ("appointmentType" in httpRequest.query) {
//                 if (
//                     httpRequest.query.appointmentType === "consultation" ||
//                     httpRequest.query.appointmentType === "follow-up"
//                 ) {
//                     appointmentType = httpRequest.query.appointmentType;
//                 }
//             }
//             if ("page" in httpRequest.query) {
//                 page = isNaN(Number(httpRequest.query.page)) ? Number(httpRequest.query.page) : 1;
//             }
//             if ("limit" in httpRequest.query) {
//                 limit = isNaN(Number(httpRequest.query.limit)) ? Number(httpRequest.query.limit) : 10;
//             }
//         }
//         try {
//             const result = await this._FetchAppointmentsLawyer.execute({
//                 appointmentStatus,
//                 appointmentType,
//                 lawyer_id: user_id,
//                 limit,
//                 page,
//                 search,
//                 sortField,
//                 sortOrder,
//             });
//             return this._httpSuccess.success_200({
//                 success: true,
//                 message: "success",
//                 data: result.data,
//                 currentPage: result.currentPage,
//                 totalPage: result.totalPage,
//                 totalCount: result.totalCount,
//             });
//         } catch (error) {
//             if (error instanceof Error) {
//                 return this._httpErrors.error_400(error.message);
//             }
//             return this._httpErrors.error_500();
//         }
//     }
// }
