

import { DomainEvent, DomainEventStatus } from '@dddforum/core';
import { EventModel } from '@dddforum/database'

interface PostDownvotedEventProps {
  postVoteId: string;
  postId: string;
  memberId: string;
}

export class PostDownvoted extends DomainEvent {
  private constructor(
      props: PostDownvotedEventProps,
      id?: string,
      retries?: number, 
      status?: DomainEventStatus,
      createdAt?: string
    ) {
      super(props.postVoteId, props, 'PostDownvoted', id, retries, status, createdAt);
    }

  public static create(props: PostDownvotedEventProps) {
    return new PostDownvoted(props);
  }

  public static toDomain (eventModel: EventModel): PostDownvoted {
      const serializedData = JSON.parse(eventModel.data) as PostDownvotedEventProps
  
      // Validate this data here using zod or something
  
      return new PostDownvoted(
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

// export class PostDownvoted extends DomainEvent {
//   constructor(
//     public readonly postId: string,
//     public readonly memberId: string,
//     public readonly id: string = randomUUID(),
//     public readonly date: Date = new Date()
//   ) {
//     super(id, date, 'PostDownvoted');
//   }
// }
