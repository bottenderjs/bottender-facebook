/* flow */
import warning from 'warning';
import { MessengerContext } from 'bottender';

export default class FacebookContext extends MessengerContext {
  // https://developers.facebook.com/docs/graph-api/reference/v3.1/object/private_replies
  sendPrivateReply(message) {
    const objectId = this._event.rawEvent.value.comment_id; // FIXME: postId

    if (this._event.isSentByPage) {
      warning(false, 'Could not sendPrivateReply to page itself.');
      return;
    }
    return this._client.sendPrivateReply(objectId, message, {
      access_token: this._customAccessToken,
    });
  }

  // https://developers.facebook.com/docs/graph-api/reference/v3.1/object/comments/
  sendComment(message) {
    const objectId = this._event.rawEvent.value.comment_id; // FIXME: postId

    if (this._event.isSentByPage) {
      warning(false, 'Could not sendComment to page itself.');
      return;
    }
    return this._client.sendComment(objectId, message, {
      access_token: this._customAccessToken,
    });
  }

  // https://developers.facebook.com/docs/graph-api/reference/v3.1/comment
  getComment(options) {
    const commentId = this._event.rawEvent.value.comment_id;

    if (!commentId) {
      warning(false, 'Could not getComment if there is no comment.');
      return;
    }

    return this._client.getComment(commentId, {
      access_token: this._customAccessToken,
      ...options,
    });
  }

  // https://developers.facebook.com/docs/graph-api/reference/v2.12/object/likes
  getLikes(options) {
    const objectId = this._event.rawEvent.value.comment_id; // FIXME: postId

    return this._client.getLikes(objectId, {
      access_token: this._customAccessToken,
      ...options,
    });
  }

  async canReplyPrivately() {
    const comment = await this.getComment({ fields: ['can_reply_privately'] });

    if (!comment) return false;

    return comment.can_reply_privately;
  }
}
