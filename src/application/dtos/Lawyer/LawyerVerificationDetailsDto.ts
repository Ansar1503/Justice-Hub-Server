export type VerificationStatus =
  | "verified"
  | "rejected"
  | "pending"
  | "requested";

export interface lawyerVerificationDetails {
  id: string;
  userId: string;
  barCouncilNumber: string;
  enrollmentCertificateNumber: string;
  certificateOfPracticeNumber: string;
  verificationStatus: VerificationStatus;
  rejectReason?: string;
  documents: {
    id: string;
    userId: string;
    enrollmentCertificate: string;
    certificateOfPractice: string;
    barCouncilCertificate: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
