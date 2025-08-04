import { IHttpResponse } from "./IHttpResponse";

/**
 * Interface representing HTTP error responses.
 */
export interface IHttpErrors {
  error_422(message?: string): IHttpResponse;
  error_400(message?: string): IHttpResponse;
  error_404(message?: string): IHttpResponse;
  error_500(message?: string): IHttpResponse;
  error_403(message?: string): IHttpResponse;
}
