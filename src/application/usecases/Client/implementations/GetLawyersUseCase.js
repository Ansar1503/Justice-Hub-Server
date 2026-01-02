"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLawyersUseCase = void 0;
const lawyer_dto_1 = require("@src/application/dtos/lawyer.dto");
class GetLawyersUseCase {
    lawyerRepository;
    constructor(lawyerRepository) {
        this.lawyerRepository = lawyerRepository;
    }
    async execute(input) {
        const { search, practiceAreas, specialisation, experienceMin, experienceMax, feeMin, feeMax, sortBy, page, limit, } = input;
        const matchStage = {
            experience: { $gte: experienceMin, $lte: experienceMax },
            consultationFee: { $gte: feeMin, $lte: feeMax },
        };
        if (practiceAreas) {
            matchStage.practiceAreas = {
                $in: Array.isArray(practiceAreas) ? practiceAreas : [practiceAreas],
            };
        }
        if (specialisation) {
            matchStage.specialisations = {
                $in: Array.isArray(specialisation) ? specialisation : [specialisation],
            };
        }
        const sortStage = {};
        switch (sortBy) {
            case "experience":
                sortStage.experience = -1;
                break;
            case "rating":
                sortStage.rating = -1;
                break;
            case "fee-low":
                sortStage.consultationFee = 1;
                break;
            case "fee-high":
                sortStage.consultationFee = -1;
                break;
            default:
                sortStage.createdAt = -1;
        }
        // console.log("match:", matchStage);
        // console.log("sortStage:", sortStage);
        // console.log("search:", search);
        // console.log("page:", page);
        // console.log("limit:", limit);
        const response = await this.lawyerRepository.findAllLawyersWithQuery({
            matchStage,
            sortStage,
            search,
            page: page ?? 1,
            limit: limit ?? 10,
        });
        const lawyers = response?.data?.map((lawyer) => new lawyer_dto_1.LawyerResponseDto(lawyer.userId, lawyer.user.name, lawyer.user.email, lawyer.user.is_blocked, lawyer.user.createdAt, lawyer.user?.mobile, lawyer.user.role, lawyer.client?.profile_image, lawyer.client?.dob, lawyer.client?.gender, {
            city: lawyer?.address?.city,
            locality: lawyer?.address?.locality,
            pincode: lawyer?.address?.pincode,
            state: lawyer?.address?.state,
        }, lawyer?.lawyerVerificationDetails?.barCouncilNumber, lawyer?.lawyerVerificationDetails?.verificationStatus, lawyer?.practiceAreasDetails?.map((p) => p?.name), lawyer?.experience, lawyer?.specialisationsDetails?.map((s) => s?.name), lawyer?.consultationFee));
        return {
            ...response,
            data: lawyers,
        };
    }
}
exports.GetLawyersUseCase = GetLawyersUseCase;
