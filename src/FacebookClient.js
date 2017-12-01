/* @flow */
import { MessengerClient } from 'messaging-api-messenger';
import AxiosError from 'axios-error';

function handleError(err) {
  const { error } = err.response.data;
  const msg = `Messenger API - ${error.code} ${error.type} ${error.message}`;
  throw new AxiosError(msg, err);
}

export default class FacebookClient extends MessengerClient {
  constructor(accessToken: string, version?: string = '2.11') {
    super(accessToken, version);
  }

  sendPrivateReply = (
    objectId: string,
    message: Object,
    { access_token: customAccessToken }: { access_token?: string } = {}
  ): Promise<any> =>
    this._axios
      .post(
        `/${objectId}/private_replies?access_token=${customAccessToken ||
          this._accessToken}`,
        {
          message,
        }
      )
      .then(res => res.data, handleError);

  sendComment = (
    objectId: string,
    message: Object,
    { access_token: customAccessToken }: { access_token?: string } = {}
  ): Promise<any> =>
    this._axios
      .post(
        `/${objectId}/comments?access_token=${customAccessToken ||
          this._accessToken}`,
        {
          message,
        }
      )
      .then(res => res.data, handleError);
}
