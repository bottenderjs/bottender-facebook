/* @flow */

import { MessengerConnector, MessengerContext } from 'bottender';
import { MessengerClient } from 'messaging-api-messenger';

import FacebookContext from './FacebookContext';
import FacebookEvent from './FacebookEvent';

type ConstructorOptions = {|
  accessToken?: string,
  appSecret?: string,
  client?: MessengerClient,
|};

export default class FacebookConnector extends MessengerConnector {
  _client: MessengerClient;
  _appSecret: ?string;

  constructor({ accessToken, appSecret, client }: ConstructorOptions) {
    super({ accessToken, appSecret, client });

    Object.defineProperty(this._client, 'sendPrivateReply', {
      enumerable: false,
      configurable: true,
      writable: true,
      value(commentId, message) {
        return this.axios.post(
          `/${commentId}/private_replies?access_token=${this._accessToken}`,
          {
            message,
          }
        );
      },
    });

    // https://developers.facebook.com/docs/graph-api/reference/v2.10/object/comments/
    Object.defineProperty(this._client, 'sendComment', {
      enumerable: false,
      configurable: true,
      writable: true,
      value(objectId, message) {
        return this.axios.post(
          `/${objectId}/comments?access_token=${this._accessToken}`,
          {
            message,
          }
        );
      },
    });
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

  createContext({ event, session, initialState }: Object): MessengerContext {
    return new FacebookContext({
      client: this._client,
      event,
      session,
      initialState,
    });
  }
}
