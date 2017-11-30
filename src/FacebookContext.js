/* flow */
import { MessengerContext } from 'bottender';

export default class FacebookContext extends MessengerContext {
  constructor({ client, event, session, initialState, customAccessToken }) {
    super({ client, event, session, initialState, customAccessToken });
  }

  // https://developers.facebook.com/docs/graph-api/reference/v2.11/object/private_replies
  async sendPrivateReply(message) {
    // TODO: https://github.com/bottenderjs/bottender-fb/issues/2
    const objectId = this._event.rawEvent.value.comment_id; // FIXME: postId
    const accessToken = this._customAccessToken || this._client._accessToken;
    return this.axios.post(
      `/${objectId}/private_replies?access_token=${accessToken}`,
      {
        message,
      }
    );
  }

  // https://developers.facebook.com/docs/graph-api/reference/v2.11/object/comments/
  async sendComment(message) {
    // TODO: https://github.com/bottenderjs/bottender-fb/issues/2
    const objectId = this._event.rawEvent.value.comment_id; // FIXME: postId
    const accessToken = this._customAccessToken || this._client._accessToken;
    return this.axios.post(
      `/${objectId}/comments?access_token=${accessToken}`,
      {
        message,
      }
    );
  }
}
