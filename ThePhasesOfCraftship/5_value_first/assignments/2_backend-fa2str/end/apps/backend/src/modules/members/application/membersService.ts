
import { MembersRepository } from "../repos/ports/membersRepository";
import { CreateMember, CreateMemberError } from "./useCases/createMember/createMember";
import { GetMemberDetails, GetMemberDetailsError } from "./useCases/getMemberDetails/getMemberDetails";
import { Commands } from '@dddforum/api/members';
import { Result } from "@dddforum/core";
import { Member } from "../domain/member";
import { UsersServiceAPI } from "../../users/externalServices/ports/usersServiceAPI";

export class MemberService {
  constructor(private membersRepository: MembersRepository, private usersAPI: UsersServiceAPI) {}

  public createMember(command: Commands.CreateMemberCommand): Promise<Result<Member, CreateMemberError>> {
    return new CreateMember(this.membersRepository, this.usersAPI).execute(command);
  }

  public getMemberDetails(userId: string): Promise<Result<Member, GetMemberDetailsError>> {
    return new GetMemberDetails(this.membersRepository).execute(userId);
  }
}