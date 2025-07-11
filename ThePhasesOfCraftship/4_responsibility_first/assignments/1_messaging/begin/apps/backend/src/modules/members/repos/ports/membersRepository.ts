
import { Member } from "../../domain/member";

export interface MembersRepository {
  findUserByUsername (username: string): Promise<Member | null>;
  getMemberByUserId (userId: string): Promise<Member | null>;
  getMemberById (memberId: string): Promise<Member | null>;
  save (member: Member): Promise<void>;
}
