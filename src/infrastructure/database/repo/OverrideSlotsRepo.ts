import { Override } from "@domain/entities/Override";
import { IOverrideRepo } from "@domain/IRepository/IOverrideRepo";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import OverrideSlotModel, {
    IOverrideSlotsModel,
} from "../model/OverrideSlotModel";
import { OverrideSlotsMapper } from "@infrastructure/Mapper/Implementations/OverrideSlotsMapper";

export class OverrideSlotsRepository implements IOverrideRepo {
    constructor(
    private mapper: IMapper<
      Override,
      IOverrideSlotsModel
    > = new OverrideSlotsMapper()
    ) {}
    async addOverrideSlots(payload: Override): Promise<Override | null> {
        const mapped = this.mapper.toPersistence(payload);
        // console.log("mapped", mapped);
        const data = await OverrideSlotModel.findOneAndUpdate(
            { lawyer_id: payload.lawyerId },
            { $push: { overrideDates: { $each: mapped.overrideDates } } },
            { upsert: true, new: true }
        );
        return this.mapper.toDomain(data);
    }
    async fetchOverrideSlots(lawyer_id: string): Promise<Override | null> {
    // console.log("lalywer", lawyer_id);
        const data = await OverrideSlotModel.findOne({ lawyer_id });
        // console.log("data", data);
        return data ? this.mapper.toDomain(data) : null;
    }
    async removeOverrideSlots(
        lawyer_id: string,
        date: Date
    ): Promise<Override | null> {
        const inputDate = new Date(date);

        const startOfDay = new Date(inputDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(inputDate);
        endOfDay.setHours(23, 59, 59, 999);

        const data = await OverrideSlotModel.findOneAndUpdate(
            { lawyer_id: lawyer_id },
            {
                $pull: {
                    overrideDates: {
                        date: {
                            $gte: startOfDay,
                            $lte: endOfDay,
                        },
                    },
                },
            },
            { new: true }
        );

        return data ? this.mapper.toDomain(data) : null;
    }
    async fetcghOverrideSlotByDate(
        lawyer_id: string,
        date: Date
    ): Promise<Override | null> {
        const inputDate = new Date(date);
        const startOfDay = new Date(inputDate.setUTCHours(0, 0, 0, 0));
        const endOfDay = new Date(inputDate.setUTCHours(23, 59, 59, 999));

        const overrideSlots = await OverrideSlotModel.findOne(
            {
                lawyer_id,
                overrideDates: {
                    $elemMatch: {
                        date: {
                            $gte: startOfDay,
                            $lte: endOfDay,
                        },
                    },
                },
            },
            {
                "overrideDates.$": 1,
            }
        );

        return overrideSlots ? this.mapper.toDomain(overrideSlots) : null;
    }
}
