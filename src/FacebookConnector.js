/* @flow */

import warning from 'warning';
import { MessengerConnector } from 'bottender';

import FacebookClient from './FacebookClient';
import FacebookContext from './FacebookContext';
import FacebookEvent from './FacebookEvent';

type ConstructorOptions = {|
  accessToken?: string,
  appSecret?: string,
  client?: FacebookClient,
  mapPageToAccessToken?: (pageId: string) => Promise<string>,
  verifyToken?: ?string,
  batchConfig?: ?Object,
|};

export default class FacebookConnector extends MessengerConnector {
  _client: FacebookClient;

  _appSecret: ?string;

  constructor({
    accessToken,
    appSecret,
    client,
    mapPageToAccessToken,
    verifyToken,
    batchConfig,
  }: ConstructorOptions) {
    const _client = client || FacebookClient.connect(accessToken || '');
    super({
      accessToken,
      appSecret,
      client: _client,
      mapPageToAccessToken,
      verifyToken,
      batchConfig,
    });
  }

  mapRequestToEvents(body: Object) {
    const rawEvents = this._getRawEventsFromRequest(body);
    const isStandby = this._isStandby(body);
    let pageId = null;
    if (body.object === 'page' && body.entry && body.entry[0]) {
      pageId = body.entry[0].id;
    }
    return rawEvents.map(
      event =>
        new FacebookEvent(event, {
          isStandby,
          // pageId is from Facebook events (Page webhook),
          // _getPageIdFromRawEvent() is from Messenger events
          pageId: pageId || this._getPageIdFromRawEvent(event),
        })
    );
  }

  async createContext(params: Object): FacebookContext {
    let customAccessToken;

    if (this._mapPageToAccessToken) {
      const { pageId } = params.event;

      if (!pageId) {
        warning(false, 'Could not find pageId from request body.');
      } else {
        customAccessToken = await this._mapPageToAccessToken(pageId);
      }
    }
    return new FacebookContext({
      ...params,
      client: this._client,
      customAccessToken,
      batchQueue: this._batchQueue,
      appId: this._appId,
    });
  }
}
