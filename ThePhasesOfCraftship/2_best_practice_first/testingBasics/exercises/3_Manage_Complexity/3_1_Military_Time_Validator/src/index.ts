export class MilitaryTime {
  public static validate(timeString: string) {
    const [startTime, endTime] = timeString.split(" - ");
    const [startTimeHour, startTimeMinute] = startTime.split(":");
    const [endTimeHour, endTimeMinute] = endTime.split(":");

    return startTimeHour <= endTimeHour;
  }
}
