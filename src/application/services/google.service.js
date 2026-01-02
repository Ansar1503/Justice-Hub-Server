"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuthCode = verifyAuthCode;
require("dotenv/config");
const google_auth_library_1 = require("google-auth-library");
const CLIENT_ID = process.env.AUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.AUTH_CLIENT_SECRET;
const REDIRECT_URI = process.env.FRONTEND_URL;
const oauth2Client = new google_auth_library_1.OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
async function verifyAuthCode(code) {
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        const ticket = await oauth2Client.verifyIdToken({
            idToken: tokens.id_token ??
                (() => {
                    throw new Error("TOKEN_MISSING");
                })(),
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return payload;
    }
    catch (err) {
        throw err;
    }
}
