type VerificationStatus = "verified" | "rejected" | "pending" | "requested";

interface LawyerDocumentsOutput {
  id: string;
  userId: string;
  enrollmentCertificate: string;
  certificateOfPractice: string;
  barCouncilCertificate: string;
  createdAt: Date;
  updatedAt: Date;
}

interface LawyerDocumentInput {
  user_id: string;
  enrollment_certificate: string;
  certificate_of_practice: string;
  bar_council_certificate: string;
}

export interface LawyerOutputDto {
  id: string;
  user_id: string;
  description: string;
  barcouncil_number: string;
  enrollment_certificate_number: string;
  certificate_of_practice_number: string;
  verification_status: VerificationStatus;
  practice_areas: string[];
  experience: number;
  specialisation: string[];
  consultation_fee: number;
  documents: LawyerDocumentsOutput;
  rejectReason: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LawyerVerificationInputDto {
  user_id: string;
  description: string;
  barcouncil_number: string;
  enrollment_certificate_number: string;
  certificate_of_practice_number: string;
  verification_status: VerificationStatus;
  practice_areas: string[];
  experience: number;
  specialisation: string[];
  consultation_fee: number;
  documents: LawyerDocumentInput;
}
