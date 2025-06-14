export class MilitaryTime {
  public static validate(timeString: string) {
    const [startTime, endTime] = timeString.split(" - ");
    if (!startTime || !endTime) return false;

    const [startTimeHour, startTimeMinute] = startTime.split(":").map(Number);
    const [endTimeHour, endTimeMinute] = endTime.split(":").map(Number);

    if (isNaN(startTimeHour) || isNaN(endTimeHour)) return false;

    if (startTimeHour > endTimeHour) return false;

    const isValidTimeRange = (hr: number, min: number) => hr <= 23 && min <= 59;

    return (
      isValidTimeRange(startTimeHour, startTimeMinute) &&
      isValidTimeRange(endTimeHour, endTimeMinute)
    );
  }
}
