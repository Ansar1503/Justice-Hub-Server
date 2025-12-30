export interface INodeMailerProvider {
    sendVerificationMail(email: string, token: string, otp: string): Promise<void>;
    sendForgotPasswordMail(email: string, token: string, otp: string): Promise<void>;
}
