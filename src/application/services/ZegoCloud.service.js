"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = createToken;
const config_1 = require("@shared/utils/ZegoCloud/config");
const CustomError_1 = require("../../interfaces/middelwares/Error/CustomError");
async function createToken({ userId, roomId, expiry = 3600, }) {
    const payload = JSON.stringify({
        room_id: roomId,
        privilege: {
            [1 /* KPrivilegeKey.PrivilegeKeyLogin */]: 1 /* KPrivilegeVal.PrivilegeEnable */,
            [2 /* KPrivilegeKey.PrivilegeKeyPublish */]: 1 /* KPrivilegeVal.PrivilegeEnable */,
        },
        stream_id_list: null,
    });
    const token = (0, config_1.generateToken04)(config_1.ZEGO_APP_ID, userId, config_1.ZEGO_SERVER_SECRET, expiry, payload);
    if (!token.startsWith("04")) {
        throw new CustomError_1.ValidationError("Token must start with 04");
    }
    return { token: token, appId: config_1.ZEGO_APP_ID };
}
