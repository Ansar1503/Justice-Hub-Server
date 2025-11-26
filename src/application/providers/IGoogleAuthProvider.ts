export interface IGoogleAuthProvider {
    verifyToken(credential: string): Promise<any>
}