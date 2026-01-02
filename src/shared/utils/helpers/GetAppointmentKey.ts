export function GetAppointmentRedisKey(
  lawyer_id: string,
  date: Date,
  timeSlot: string
): string {
  const formattedDate = date.toISOString().split("T")[0];
  return `temp:appointment:${lawyer_id}:${formattedDate}:${timeSlot}`;
}
