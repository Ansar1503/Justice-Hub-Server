import {
  GetLawyersInputDto,
  GetLawyersOutputDto,
} from "@src/application/dtos/client/GetLawyersDto";
import { IGetLawyersUseCase } from "../IGetLawyerUseCase";
import { ILawyerRepository } from "@domain/IRepository/ILawyerRepo";
import { LawyerResponseDto } from "@src/application/dtos/lawyer.dto";

export class GetLawyersUseCase implements IGetLawyersUseCase {
  constructor(private lawyerRepository: ILawyerRepository) {}
  async execute(input: GetLawyersInputDto): Promise<GetLawyersOutputDto> {
    const {
      search,
      practiceAreas,
      specialisation,
      experienceMin,
      experienceMax,
      feeMin,
      feeMax,
      sortBy,
      page,
      limit,
    } = input;

    const matchStage: any = {
      experience: { $gte: experienceMin, $lte: experienceMax },
      consultation_fee: { $gte: feeMin, $lte: feeMax },
      verification_status: "verified",
    };

    if (practiceAreas) {
      matchStage.practice_areas = {
        $in: Array.isArray(practiceAreas) ? practiceAreas : [practiceAreas],
      };
    }

    if (specialisation) {
      matchStage.specialisation = {
        $in: Array.isArray(specialisation) ? specialisation : [specialisation],
      };
    }

    const sortStage: any = {};
    switch (sortBy) {
      case "experience":
        sortStage.experience = -1;
        break;
      case "rating":
        sortStage.rating = -1;
        break;
      case "fee-low":
        sortStage.consultation_fee = 1;
        break;
      case "fee-high":
        sortStage.consultation_fee = -1;
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
    // console.log("response:", response);
    const lawyers = response?.data?.map(
      (lawyer: any) =>
        new LawyerResponseDto(
          lawyer.user_id,
          lawyer.user.name,
          lawyer.user.email,
          lawyer.user.is_blocked,
          lawyer.user.createdAt,
          lawyer.user?.mobile,
          lawyer.user.role,
          lawyer.client?.profile_image,
          lawyer.client?.dob,
          lawyer.client?.gender,
          {
            city: lawyer?.address?.city,
            locality: lawyer?.address?.locality,
            pincode: lawyer?.address?.pincode,
            state: lawyer?.address?.state,
          },
          lawyer.barcouncil_number,
          lawyer.verification_status,
          lawyer.practice_areas,
          lawyer.experience,
          lawyer.specialisation,
          lawyer.consultation_fee
        )
    );
    return {
      ...response,
      data: lawyers,
    };
  }
}
