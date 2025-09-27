import { Client } from "../../domain/entities/Client";
import { User } from "../../domain/entities/User";
import { PracticeAreaDto } from "./PracticeAreas/PracticeAreasDto";
import { SpecializationDto } from "./Specializations/SpecializationDto";

export class LawyerResponseDto implements Partial<Client>, Partial<User> {
    constructor(
    public user_id: string,
    public name: string,
    public email: string,
    public is_blocked: boolean,
    public createdAt: Date,
    public mobile: string,
    public role: "lawyer" | "client" | "admin",
    public profile_image?: string,
    public dob?: string,
    public gender?: "male" | "female" | "others",
    public Address?: {
      city?: string;
      locality?: string;
      pincode?: string;
      state?: string;
    },
    public barcouncil_number?: string,
    public verification_status?:
      | "verified"
      | "rejected"
      | "pending"
      | "requested",
    public practice_areas?: PracticeAreaDto[] | [],
    public experience?: number,
    public specialisation?: SpecializationDto[] | [],
    public consultation_fee?: number,
    public description?: string,
    public certificate_of_practice_number?: string,
    public enrollment_certificate_number?: string
    ) {}
}
