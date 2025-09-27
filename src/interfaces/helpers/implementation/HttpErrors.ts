import { IHttpErrors } from "../IHttpErrors.";
import { IHttpResponse } from "../IHttpResponse";

export class HttpErrors implements IHttpErrors {
    error_422(message = "Unprocessable Entity"): IHttpResponse {
        return {
            statusCode: 422,
            body: { error: message },
        };
    }

    error_400(message = "Bad Request"): IHttpResponse {
        return {
            statusCode: 400,
            body: { error: message },
        };
    }

    error_404(message = "Not Found"): IHttpResponse {
        return {
            statusCode: 404,
            body: { error: message },
        };
    }

    error_500(message = "Internal Error"): IHttpResponse {
        return {
            statusCode: 500,
            body: { error: message },
        };
    }

    error_403(message = "Forbidden"): IHttpResponse {
        return {
            statusCode: 403,
            body: { error: message },
        };
    }
}
