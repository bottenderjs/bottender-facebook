/* @flow */
import AxiosError from 'axios-error';
import { MessengerClient } from 'messaging-api-messenger';

function handleError(err) {
  const { error } = err.response.data;
  const msg = `Messenger API - ${error.code} ${error.type} ${error.message}`;
  throw new AxiosError(msg, err);
}

type ClientConfig = {
  accessToken: string,
  appSecret?: string,
  version?: string,
  origin?: string,
  onRequest?: Function,
};

export default class FacebookClient extends MessengerClient {
  static connect = (
    accessTokenOrConfig: string | ClientConfig,
    version?: string = '4.0'
  ): FacebookClient => new FacebookClient(accessTokenOrConfig, version);

  sendPrivateReply = (
    objectId: string,
    text: string,
    options: { access_token?: string } = {}
  ): Promise<any> => this.sendText({ comment_id: objectId }, text, options);

  sendComment = (
    objectId: string,
    comment:
      | string
      | {
          attachment_id?: string,
          attachment_share_url?: string,
          attachment_url?: string,
          message?: string,
        },
    { access_token: customAccessToken }: { access_token?: string } = {}
  ): Promise<any> => {
    let body;

    if (typeof comment === 'string') {
      body = {
        message: comment,
      };
    } else {
      body = comment;
    }

    return this._axios
      .post(
        `/${objectId}/comments?access_token=${customAccessToken ||
          this._accessToken}`,
        body
      )
      .then(res => res.data, handleError);
  };

  sendLike = (
    objectId: string,
    { access_token: customAccessToken }: { access_token?: string } = {}
  ): Promise<any> =>
    this._axios
      .post(
        `/${objectId}/likes?access_token=${customAccessToken ||
          this._accessToken}`
      )
      .then(res => res.data, handleError);

  getComment = (
    commentId: string,
    {
      fields,
      access_token: customAccessToken,
    }: { fields?: ?(Array<string> | string), access_token?: string } = {}
  ): Promise<any> => {
    const conjunctFields = Array.isArray(fields) ? fields.join(',') : fields;
    const fieldsQuery = conjunctFields ? `fields=${conjunctFields}&` : '';

    return this._axios
      .get(
        `/${commentId}?${fieldsQuery}access_token=${customAccessToken ||
          this._accessToken}`
      )
      .then(res => res.data, handleError);
  };

  getLikes = (
    objectId: string,
    {
      summary,
      access_token: customAccessToken,
    }: { summary?: boolean, access_token?: string } = {}
  ): Promise<any> =>
    this._axios
      .get(
        `/${objectId}/likes?${
          summary ? 'summary=true&' : ''
        }access_token=${customAccessToken || this._accessToken}`
      )
      .then(res => res.data, handleError);
}
