/* @flow */

import { MessengerConnector, MessengerContext } from 'bottender';
import warning from 'warning';

import FacebookContext from './FacebookContext';
import FacebookEvent from './FacebookEvent';
import FacebookClient from './FacebookClient';

type ConstructorOptions = {|
  accessToken?: string,
  appSecret?: string,
  client?: FacebookClient,
  mapPageToAccessToken?: (pageId: string) => Promise<string>,
|};

export default class FacebookConnector extends MessengerConnector {
  _client: FacebookClient;
  _appSecret: ?string;

  constructor({
    accessToken,
    appSecret,
    client,
    mapPageToAccessToken,
  }: ConstructorOptions) {
    const _client = client || FacebookClient.connect(accessToken);
    super({ accessToken, appSecret, client: _client, mapPageToAccessToken });
  }

  // FIXME: should not rely on private method
  _getRawEventsFromRequest(body: Object) {
    if (body.entry) {
      const { entry } = body;

      return entry
        .map(ent => {
          if (ent.messaging) {
            return ent.messaging[0];
          }

          if (ent.standby) {
            return ent.standby[0];
          }

          // Patch For Facebook Start
          if (ent.changes) {
            return ent.changes[0];
          }
          // Patch For Facebook End

          return null;
        })
        .filter(event => event != null);
    }

    return [body];
  }

  mapRequestToEvents(body: Object) {
    const rawEvents = this._getRawEventsFromRequest(body);
    const isStandby = this._isStandby(body);
    return rawEvents.map(event => new FacebookEvent(event, { isStandby }));
  }

  async createContext({
    event,
    session,
    initialState,
  }: Object): MessengerContext {
    let customAccessToken;
    if (this._mapPageToAccessToken) {
      const { rawEvent } = event;

      let pageId = null;

      if (rawEvent.message && rawEvent.message.is_echo && rawEvent.sender) {
        pageId = rawEvent.sender.id;
      } else if (rawEvent.recipient) {
        pageId = rawEvent.recipient.id;
      }

      if (!pageId) {
        warning(false, 'Could not find pageId from request body.');
      } else {
        customAccessToken = await this._mapPageToAccessToken(pageId);
      }
    }
    return new FacebookContext({
      client: this._client,
      event,
      session,
      initialState,
      customAccessToken,
    });
  }
}
