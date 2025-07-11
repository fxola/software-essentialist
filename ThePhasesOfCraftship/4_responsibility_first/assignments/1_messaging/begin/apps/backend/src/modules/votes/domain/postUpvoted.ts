

import { DomainEvent } from '@dddforum/core';
import { randomUUID } from 'crypto';

export class PostUpvoted extends DomainEvent {
  constructor(
    public readonly postId: string,
    public readonly memberId: string,
    public readonly id: string = randomUUID(),
    public readonly date: Date = new Date()
  ) {
    super(id, date, 'PostUpvoted');
  }
}
