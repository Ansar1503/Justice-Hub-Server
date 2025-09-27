import {
    ZEGO_SERVER_SECRET,
    GenerateToken,
    generateToken04,
    KPrivilegeKey,
    KPrivilegeVal,
    ZEGO_APP_ID,
} from "@shared/utils/ZegoCloud/config";
import { ValidationError } from "../../interfaces/middelwares/Error/CustomError";

export async function createToken({
    userId,
    roomId,
    expiry = 3600,
}: GenerateToken): Promise<{ token: string; appId: number }> {
    const payload = JSON.stringify({
        room_id: roomId,
        privilege: {
            [KPrivilegeKey.PrivilegeKeyLogin]: KPrivilegeVal.PrivilegeEnable,
            [KPrivilegeKey.PrivilegeKeyPublish]: KPrivilegeVal.PrivilegeEnable,
        },
        stream_id_list: null,
    });

    const token = generateToken04(ZEGO_APP_ID, userId, ZEGO_SERVER_SECRET, expiry, payload);

    if (!token.startsWith("04")) {
        throw new ValidationError("Token must start with 04");
    }
    console.log(`Token created ${token} video call`);
    return { token: token, appId: ZEGO_APP_ID };
}
