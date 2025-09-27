export interface VerifyEmailInput {
    email: string;
    token: string;
}

export interface VerifyEmailByOtpInput {
    email: string;
    otp: string;
}
