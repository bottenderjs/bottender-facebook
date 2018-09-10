/* flow */
import warning from 'warning';
import { MessengerContext } from 'bottender';

export default class FacebookContext extends MessengerContext {
  // https://developers.facebook.com/docs/graph-api/reference/v2.11/object/private_replies
  async sendPrivateReply(message) {
    const objectId = this._event.rawEvent.value.comment_id; // FIXME: postId

    if (this._event.isSentByPage) {
      warning(false, 'Could not sendPrivateReply to page itself.');
      return;
    }
    return this._client.sendPrivateReply(objectId, message, {
      access_token: this._customAccessToken,
    });
  }

  // https://developers.facebook.com/docs/graph-api/reference/v2.11/object/comments/
  async sendComment(message) {
    const objectId = this._event.rawEvent.value.comment_id; // FIXME: postId

    if (this._event.isSentByPage) {
      warning(false, 'Could not sendComment to page itself.');
      return;
    }
    return this._client.sendComment(objectId, message, {
      access_token: this._customAccessToken,
    });
  }
}
