

import { DomainEvent, DomainEventStatus } from '@dddforum/core';
import { EventModel } from '@dddforum/database'

interface PostUpdatedEventProps {
  postVoteId: string
  postId: string;
  memberId: string;
}

export class PostUpvoted extends DomainEvent {
  private constructor(
    props: PostUpdatedEventProps,
    id?: string,
    retries?: number, 
    status?: DomainEventStatus,
    createdAt?: string
  ) {
    super('PostUpvoted', props, props.postVoteId, id, retries, status, createdAt);
  }

  public static create (props: PostUpdatedEventProps) {
    return new PostUpvoted(props);
  }

  public static toDomain (eventModel: EventModel): PostUpvoted {
    const serializedData = JSON.parse(eventModel.data) as PostUpdatedEventProps

    // Validate this data here using zod or something

    return new PostUpvoted(
      {
        postVoteId: eventModel.aggregateId,
        postId: serializedData.postId,
        memberId: serializedData.memberId
      }, 
      eventModel.id, eventModel.retries, 
      eventModel.status as DomainEventStatus, 
      eventModel.dateCreated.toISOString()
    )
  }
}


// import { DomainEvent } from '@dddforum/core';
// import { randomUUID } from 'crypto';

// export class PostUpvoted extends DomainEvent {
//   constructor(
//     public readonly postId: string,
//     public readonly memberId: string,
//     public readonly id: string = randomUUID(),
//     public readonly date: Date = new Date()
//   ) {
//     super(id, date, 'PostUpvoted');
//   }
// }
