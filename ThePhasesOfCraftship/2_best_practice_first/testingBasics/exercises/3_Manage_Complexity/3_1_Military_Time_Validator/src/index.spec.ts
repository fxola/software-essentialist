import { MilitaryTime } from ".";

describe("military time validator", () => {
  describe("Knows that start time must be lower than end time", () => {
    it('knows that "23:00 - 15:40" is invalid', () => {
      expect(MilitaryTime.validate("23:00 - 15:40")).toBeFalsy();
    });

    it('knows that "23:00 - 23:45" is valid', () => {
      expect(MilitaryTime.validate("23:00 - 23:45")).toBeTruthy();
    });

    it('knows that "23:00 - 23:01" is valid', () => {
      expect(MilitaryTime.validate("23:00 - 23:01")).toBeTruthy();
    });

    it('knows that "13:00 - 09:01" is invalid', () => {
      expect(MilitaryTime.validate("13:00 - 09:01")).toBeFalsy();
    });
  });

  describe("Knows that time has maximum of 23 hours and a maximum of 59 minutes", () => {
    it('knows that "25:00 - 26:01" is invalid', () => {
      expect(MilitaryTime.validate("25:00 - 26:01")).toBeFalsy();
    });

    it('knows that "24:00 - 12:45" is invalid', () => {
      expect(MilitaryTime.validate("24:00 - 12:45")).toBeFalsy();
    });

    it('knows that "23:59 - 23:60" is invalid', () => {
      expect(MilitaryTime.validate("23:59 - 23:60")).toBeFalsy();
    });

    it('knows that "23:45 - 23:46" is valid', () => {
      expect(MilitaryTime.validate("23:45 - 23:46")).toBeTruthy();
    });

    it('knows that "23:58 - 23:59" is valid', () => {
      expect(MilitaryTime.validate("23:58 - 23:59")).toBeTruthy();
    });
  });
});
