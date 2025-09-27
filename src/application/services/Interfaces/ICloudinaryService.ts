export interface ICloudinaryService {
    deleteFile(url: string): Promise<void>;
    extractPublicIdFromUrl(url: string): string;
    genrateSecureUrl(publicId: string): Promise<string>;
}
