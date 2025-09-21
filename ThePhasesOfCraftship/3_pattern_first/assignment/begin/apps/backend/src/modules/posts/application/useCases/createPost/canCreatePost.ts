import { Member } from "../../../../members/domain/member";

export class CanCreatePostPolicy {
  public static isAllowed(member: Member): boolean {
    const isLevel2Member = member.reputationLevel === "Level2";
    const isLevel3Member = member.reputationLevel === "Level3";

    return isLevel2Member || isLevel3Member;
  }
}
