import { IPasswordManager } from "@src/application/providers/PasswordHasher";
import * as bcrypt from "bcryptjs";

export class PasswordManager implements IPasswordManager {
    private readonly _saltRounds: number;

    constructor(saltRounds: number = 10) {
        this._saltRounds = saltRounds;
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(this._saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}
