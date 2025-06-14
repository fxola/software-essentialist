import { MilitaryTime } from ".";

describe("military time validator", () => {
  describe("Knows that start time must be lower than end time", () => {
    it('knows that "23:00 - 15:40" is invalid', () => {
      expect(MilitaryTime.validate("23:00 - 15:40")).toBeFalsy();
    });

    it('knows that "23:00 - 23:45" is valid', () => {
      expect(MilitaryTime.validate("23:00 - 23:45")).toBeTruthy();
    });
  });
});
