"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveOverrideSlots = void 0;
const http_1 = require("http");
class RemoveOverrideSlots {
    overrideRepo;
    constructor(overrideRepo) {
        this.overrideRepo = overrideRepo;
    }
    async execute(input) {
        const inputDate = new Date(input.date);
        const overrideDate = new Date(inputDate.getTime() - inputDate.getTimezoneOffset() * 60000);
        const existingOverrideSlots = await this.overrideRepo.fetchOverrideSlots(input.lawyer_id);
        // console.log("override slots", existingOverrideSlots);
        if (!existingOverrideSlots) {
            const error = new Error("Override slots not found");
            error.code = http_1.STATUS_CODES.NOT_FOUND;
            throw error;
        }
        if (existingOverrideSlots.overrideDates.length === 0) {
            const error = new Error("No override slots available");
            error.code = http_1.STATUS_CODES.NOT_FOUND;
            throw error;
        }
        // if (
        //   existingOverrideSlots.overrideDates.find(
        //     (override) => override.date === overrideDate
        //   ) === undefined
        // ) {
        //   const error: any = new Error("Override slot not found");
        //   error.code = STATUS_CODES.NOT_FOUND;
        //   throw error;
        // }
        const updatedOverrideSlots = await this.overrideRepo.removeOverrideSlots(input.lawyer_id, overrideDate);
        if (!updatedOverrideSlots)
            throw new Error("Remvoe override slots failed");
        return {
            lawyer_id: updatedOverrideSlots.lawyerId,
            overrideDates: updatedOverrideSlots.overrideDates,
        };
    }
}
exports.RemoveOverrideSlots = RemoveOverrideSlots;
