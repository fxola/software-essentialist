import { Result, UseCase, success, fail } from "@dddforum/core";
import { MembersRepository } from "../../../repos/ports/membersRepository";
import { Member } from "../../../domain/member";
import { ApplicationErrors } from "@dddforum/errors/application";
import { Commands } from "@dddforum/api/members";
import { EventBus } from "@dddforum/bus";
import { ServerErrors } from "@dddforum/errors/server";

export type CreateMemberError = ApplicationErrors.ValidationError | ApplicationErrors.NotFoundError | ApplicationErrors.ConflictError;

export class CreateMember implements UseCase<Commands.CreateMemberCommand, Result<Member, CreateMemberError>> {
  constructor(
    private memberRepository: MembersRepository,
    private eventBus: EventBus,
  ) {}

  async execute(request: Commands.CreateMemberCommand): Promise<Result<Member, CreateMemberError>> {
    const { userId, username } = request.props;

    const existingMember = await this.memberRepository.getMemberByUserId(userId);

    if (existingMember) {
      return success(existingMember);
    }

    const userWithExistingUsername = await this.memberRepository.findUserByUsername(username);

    if (userWithExistingUsername) {
      return fail(new ApplicationErrors.ConflictError("member"));
    }

    const memberOrError = Member.create({ userId, username });

    if (memberOrError.isFailure()) {
      return fail(memberOrError.getError());
    }

    try {
      const member = memberOrError.getValue();
      await this.memberRepository.save(member);
      this.eventBus.publishEvents(member.getDomainEvents());
      return success(member);
    } catch (e) {
      return fail(new ServerErrors.DatabaseError());
    }
  }
}
