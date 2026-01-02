"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthProvider = void 0;
const googleapis_1 = require("googleapis");
require("dotenv/config");
class GoogleAuthProvider {
    _oauthClient;
    constructor() {
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
            throw new Error("Google Client ID or Secret not found.");
        }
        this._oauthClient = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
    }
    async verifyToken(credential) {
        const ticket = await this._oauthClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        return ticket.getPayload();
    }
}
exports.GoogleAuthProvider = GoogleAuthProvider;
