import { MilitaryTime } from ".";

describe("military time validator", () => {
  describe("Knows that start time must be lower than end time", () => {
    const invalidRange = ["23:00 - 15:40", "13:00 - 09:01"];
    const validRange = ["23:00 - 23:45", "23:00 - 23:01", "01:12 - 14:32"];

    it.each(invalidRange)("knows that %s is invalid", (range) => {
      expect(MilitaryTime.validate(range)).toBeFalsy();
    });

    it.each(validRange)("knows that %s is valid", (range) => {
      expect(MilitaryTime.validate(range)).toBeTruthy();
    });
  });

  describe("Knows that a valid time has hours ranging between 0 to 23 hours and minutes ranging between 0 to 59 minutes", () => {
    const invalidRange = [
      "25:00 - 26:01",
      "24:00 - 12:45",
      "23:59 - 23:60",
      "-23:45 - 23:46",
      "25:00 - 12:23",
    ];

    const validRange = [
      "23:45 - 23:46",
      "23:58 - 23:59",
      "23:58 - 23:58",
      "22:00 - 23:12",
    ];

    it.each(invalidRange)("knows that %s is invalid", (range) => {
      expect(MilitaryTime.validate(range)).toBeFalsy();
    });

    it.each(validRange)("knows that %s is valid", (range) => {
      expect(MilitaryTime.validate(range)).toBeTruthy();
    });
  });

  describe("Knows that malformed time strings should be invalid", () => {
    const malformedTimeStrings = [
      "AS:00 - BO:01",
      "AS:aa - BO:bb",
      "abc - def",
      "00:00 23:00",
      "0000 - 2300",
      "23-45 - 23-46",
    ];

    it.each(malformedTimeStrings)("knows that %s is invalid", (range) => {
      expect(MilitaryTime.validate(range)).toBeFalsy();
    });
  });
});
