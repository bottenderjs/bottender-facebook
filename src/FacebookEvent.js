/* @flow */

import { MessengerEvent } from 'bottender';

type Stauts = {
  item: 'stauts',
};

type Comment = {
  item: 'comment',
  sender_name: string,
  comment_id: string,
  sender_id: number,
  post_id: string,
  verb: 'add' | 'remove',
  parent_id: string,
  created_time: number,
  message: string,
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

  get isStatusRemove(): boolean {
    return this.isStatus && this.rawEvent.value.verb === 'remove';
  }

  get status(): Stauts {
    return this.isStatus && this.rawEvent.value;
  }

  get isComment(): boolean {
    return this.isFeed && this.rawEvent.value.item === 'comment';
  }

  get isCommentAdd(): boolean {
    return this.isComment && this.rawEvent.value.verb === 'add';
  }

  get isCommentRemove(): boolean {
    return this.isComment && this.rawEvent.value.verb === 'remove';
  }

  get comment(): Comment {
    return this.isComment && this.rawEvent.value;
  }
}
