/* @flow */

import { MessengerEvent } from 'bottender';

type Stauts = {
  from: {
    id: string,
    name: string,
  },
  item: 'stauts',
  post_id: string,
  verb: 'add' | 'edited',
  published: number,
  created_time: number,
  message: string,
};

type Post = {
  recipient_id: string,
  from: {
    id: string,
  },
  item: 'post',
  post_id: string,
  verb: 'remove',
  created_time: number,
};

type Comment = {
  from: {
    id: string,
    name?: string,
  },
  item: 'comment',
  comment_id: string,
  post_id: string,
  verb: 'add' | 'edited' | 'remove',
  parent_id: string,
  created_time: number,
  message: string,
};

type Like = {
  from: {
    id: string,
    name?: string,
  },
  parent_id: string,
  comment_id: string,
  post_id: string,
  verb: 'add' | 'remove',
  item: 'like',
  created_time: number,
};

type Reaction = {
  reaction_type: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry',
  from: {
    id: string,
  },
  parent_id: string,
  comment_id: string,
  post_id: string,
  verb: 'add' | 'edit' | 'remove',
  item: 'reaction',
  created_time: number,
};

export default class FacebookEvent extends MessengerEvent {
  get isConversation(): boolean {
    return this.rawEvent.field === 'conversation';
  }

  get isFeed(): boolean {
    return this.rawEvent.field === 'feed';
  }

  get isStatus(): boolean {
    return this.isFeed && this.rawEvent.value.item === 'status';
  }

  get isStatusAdd(): boolean {
    return this.isStatus && this.rawEvent.value.verb === 'add';
  }

  get isStatusEdited(): boolean {
    return this.isStatus && this.rawEvent.value.verb === 'edited';
  }

  get status(): ?Stauts {
    if (this.isStatus) {
      return this.rawEvent.value;
    }
    return null;
  }

  get isPost(): boolean {
    return this.isFeed && this.rawEvent.value.item === 'post';
  }

  get isPostRemove(): boolean {
    return this.isPost && this.rawEvent.value.verb === 'remove';
  }

  get post(): ?Post {
    if (this.isPost) {
      return this.rawEvent.value;
    }
    return null;
  }

  get isComment(): boolean {
    return this.isFeed && this.rawEvent.value.item === 'comment';
  }

  get isCommentAdd(): boolean {
    return this.isComment && this.rawEvent.value.verb === 'add';
  }

  get isCommentEdited(): boolean {
    return this.isComment && this.rawEvent.value.verb === 'edited';
  }

  get isCommentRemove(): boolean {
    return this.isComment && this.rawEvent.value.verb === 'remove';
  }

  get comment(): ?Comment {
    if (this.isComment) {
      return this.rawEvent.value;
    }
    return null;
  }

  get isLike(): boolean {
    return this.isFeed && this.rawEvent.value.item === 'like';
  }

  get isLikeAdd(): boolean {
    return this.isLike && this.rawEvent.value.verb === 'add';
  }

  get isLikeRemove(): boolean {
    return this.isLike && this.rawEvent.value.verb === 'remove';
  }

  get like(): ?Like {
    if (this.isLike) {
      return this.rawEvent.value;
    }
    return null;
  }

  get isReaction(): boolean {
    return this.isFeed && this.rawEvent.value.item === 'reaction';
  }

  get isReactionAdd(): boolean {
    return this.isReaction && this.rawEvent.value.verb === 'add';
  }

  get isReactionEdit(): boolean {
    return this.isReaction && this.rawEvent.value.verb === 'edit';
  }

  get isReactionRemove(): boolean {
    return this.isReaction && this.rawEvent.value.verb === 'remove';
  }

  get reaction(): ?Reaction {
    if (this.isReaction) {
      return this.rawEvent.value;
    }
    return null;
  }
}
