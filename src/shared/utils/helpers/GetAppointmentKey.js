"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAppointmentRedisKey = GetAppointmentRedisKey;
function GetAppointmentRedisKey(lawyer_id, date, timeSlot) {
    const formattedDate = date.toISOString().split("T")[0];
    return `temp:appointment:${lawyer_id}:${formattedDate}:${timeSlot}`;
}
