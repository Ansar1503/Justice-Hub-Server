export interface GoogleAuthInputDto {
    credential: string;
}

export interface GoogleAuthOutputDto {
    accesstoken: string;
    refreshToken: string;
    user: {
        email: string;
        name: string;
        role: string;
        user_id: string;
    };
}