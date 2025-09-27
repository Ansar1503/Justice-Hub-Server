export interface INodeMailerProvider {
    sendVerificationMail(email: string, token: string, otp: string): Promise<void>;
}
