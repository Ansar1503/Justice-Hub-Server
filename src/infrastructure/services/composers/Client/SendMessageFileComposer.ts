import { SendMessageFileController } from "@interfaces/controller/Client/SendMessageFileController";
import { IController } from "@interfaces/controller/Interface/IController";

export function SendMessageFileComposer(): IController {
    return new SendMessageFileController();
}
