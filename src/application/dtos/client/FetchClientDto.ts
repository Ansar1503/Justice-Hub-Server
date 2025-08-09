type VerificationStatus = "verified" | "rejected" | "pending" | "requested";

export interface FetchClientDto {
  email: string;
  mobile: string;
  name: string;
  role: "lawyer" | "client" | "admin";
  user_id: string;
  dob?: string;
  gender?: string;
  profile_image?: string;
  is_blocked: boolean;
  is_verified: boolean;
  address: {
    city: string;
    locality: string;
    state: string;
    pincode: string;
  };
  lawyerVerfication?: VerificationStatus;
}
