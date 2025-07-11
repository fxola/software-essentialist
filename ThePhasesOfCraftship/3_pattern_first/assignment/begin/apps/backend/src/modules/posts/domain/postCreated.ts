

import { DomainEvent } from '@dddforum/core';
import { randomUUID } from 'crypto';

export class PostCreated extends DomainEvent {
  constructor(
    public readonly postId: string,
    public readonly memberId: string,
    public readonly id: string = randomUUID(),
    public readonly date: Date = new Date()
  ) {
    super(id, date, 'PostCreated');
  }
}
