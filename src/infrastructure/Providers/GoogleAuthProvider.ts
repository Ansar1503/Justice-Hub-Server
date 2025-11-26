import { google } from "googleapis";
import "dotenv/config";

export class GoogleAuthProvider {
    private _oauthClient;

    constructor() {
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
            throw new Error("Google Client ID or Secret not found.")
        }
        this._oauthClient = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        );
    }
    async verifyToken(credential: string) {
        const ticket = await this._oauthClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        return ticket.getPayload();
    }
}
