import { Member } from "../../../../members/domain/member";
import { Types } from "@dddforum/api/members";

export class CanPostCommentPolicy {
  public static isAllowed(member: Member): boolean {
    const isLevel1Member = member.reputationLevel === "Level1";
    const isLevel2Member = member.reputationLevel === "Level2";
    const isLevel3Member = member.reputationLevel === "Level3";

    return isLevel1Member || isLevel2Member || isLevel3Member;
  }
}
