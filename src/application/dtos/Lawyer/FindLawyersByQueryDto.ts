type VerificationStatus = "verified" | "rejected" | "pending" | "requested";
interface PracticeArea {
    id: string;
    name: string;
}
interface Specialization {
    id: string;
    name: string;
}

export interface AggregatedLawyerProfile {
    userId: string;
    createdAt: Date | string;
    personalDetails: {
        name: string;
        email: string;
        isVerified: boolean;
        profileImage: string;
        mobile: string;
        address: {
            state: string;
            city: string;
            locality: string;
            pincode: string;
        };
    };

    ProfessionalDetails: {
        description: string;
        practiceAreas: PracticeArea[] | [];
        experience: number;
        specialisations: Specialization[] | [];
        consultationFee: number;
        createdAt: Date | string;
        updatedAt: Date | string;
    };

    verificationDetails: {
        barCouncilNumber: string;
        enrollmentCertificateNumber: string;
        certificateOfPracticeNumber: string;
        verificationStatus: VerificationStatus;
        rejectReason: string | null;
        documents: string[] | [];
        createdAt: Date | string;
        updatedAt: Date | string;
    };

    verificationDocuments: {
        enrollmentCertificate: string;
        certificateOfPractice: string;
        barCouncilCertificate: string;
    };
}
