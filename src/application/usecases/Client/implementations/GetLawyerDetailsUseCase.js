"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLawyerDetailsUseCase = void 0;
class GetLawyerDetailsUseCase {
    userRepository;
    clientRepository;
    addressRepository;
    lawyerRepository;
    lawyerVerification;
    constructor(userRepository, clientRepository, addressRepository, lawyerRepository, lawyerVerification) {
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.addressRepository = addressRepository;
        this.lawyerRepository = lawyerRepository;
        this.lawyerVerification = lawyerVerification;
    }
    async execute(input) {
        const user = await this.userRepository.findByuser_id(input);
        if (!user)
            throw new Error("USER_NOT_FOUND");
        if (user.is_blocked)
            throw new Error("USER_BLOCKED");
        const client = await this.clientRepository.findByUserId(input);
        const address = await this.addressRepository.find(input);
        const lawyer = await this.lawyerRepository.findUserId(input);
        const lawyerVerification = await this.lawyerVerification.findByUserId(input);
        if (!lawyerVerification)
            throw new Error("LAWYER_UNVERIFIED");
        if (!lawyer)
            throw new Error("LAWYER_UNAVAILABLE");
        if (lawyerVerification.verificationStatus !== "verified")
            throw new Error("LAWYER_UNVERIFIED");
        const responseData = {
            createdAt: user.createdAt,
            email: user.email,
            is_blocked: user.is_blocked,
            mobile: user.mobile || "",
            name: user.name,
            role: user.role,
            user_id: user.user_id,
            Address: {
                city: address?.city,
                locality: address?.city,
                pincode: address?.pincode,
                state: address?.state,
            },
            barcouncil_number: lawyerVerification.barCouncilNumber,
            consultation_fee: lawyer.consultationFee,
            dob: client?.dob,
            experience: lawyer.experience,
            gender: client?.gender,
            practice_areas: lawyer?.practiceAreas,
            profile_image: client?.profile_image,
            specialisation: lawyer?.specializations,
            verification_status: lawyerVerification.verificationStatus,
            description: lawyer.description || "",
            certificate_of_practice_number: lawyerVerification.certificateOfPracticeNumber || "",
            enrollment_certificate_number: lawyerVerification.enrollmentCertificateNumber || "",
        };
        return responseData;
    }
}
exports.GetLawyerDetailsUseCase = GetLawyerDetailsUseCase;
