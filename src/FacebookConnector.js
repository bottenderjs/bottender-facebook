/* @flow */

import crypto from 'crypto';

import { MessengerContext } from 'bottender';
import { MessengerClient } from 'messaging-api-messenger';
import warning from 'warning';
import isAfter from 'date-fns/is_after';
import isValid from 'date-fns/is_valid';

import FacebookEvent from './FacebookEvent';

export default class FacebookConnector {
  constructor({ accessToken, appSecret }) {
    this._client = MessengerClient.connect(accessToken);
    this._appSecret = appSecret;
    if (!this._appSecret) {
      warning(
        false,
        '`appSecret` is not set. Will bypass Messenger signature validation.\nPass in `appSecret` to perform Messenger signature validation.'
      );
    }

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

  _getRawEventsFromRequest(body) {
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

  _isStandby(body) {
    if (!body.entry) return false;
    const entry = body.entry[0];

    return !!entry.standby;
  }

  _profilePicExpired(user) {
    try {
      // Facebook CDN returns expiration time in the key `oe` in url params
      // https://stackoverflow.com/questions/27595679/how-to-efficiently-retrieve-expiration-date-for-facebook-photo-url-and-renew-it/27596727#27596727
      const oe = user.profile_pic.split('oe=')[1];
      const timestamp = +`0x${oe}` * 1000;
      const expireTime = new Date(timestamp);
      return !(isValid(expireTime) && isAfter(expireTime, new Date()));
    } catch (e) {
      return true;
    }
  }

  // FIXME: facebook? but should enable verifyToken in createServer
  get platform() {
    return 'messenger';
  }

  get client() {
    return this._client;
  }

  getUniqueSessionKey(body) {
    const rawEvent = this._getRawEventsFromRequest(body)[0];
    if (rawEvent.message && rawEvent.message.is_echo && rawEvent.recipient) {
      return rawEvent.recipient.id;
    }
    if (rawEvent.sender) {
      return rawEvent.sender.id;
    }
    return null;
  }

  async updateSession(session, body) {
    if (!session.user || this._profilePicExpired(session.user)) {
      const senderId = this.getUniqueSessionKey(body);
      // FIXME: refine user
      const user = await this._client.getUserProfile(senderId);
      session.user = {
        _updatedAt: new Date().toISOString(),
        ...user,
        id: senderId,
      };
    }

    // TODO: remove later
    if (!session.user._updatedAt) {
      session.user._updatedAt = new Date().toISOString();
    }

    Object.freeze(session.user);
    Object.defineProperty(session, 'user', {
      configurable: false,
      enumerable: true,
      writable: false,
      value: session.user,
    });
  }

  mapRequestToEvents(body) {
    const rawEvents = this._getRawEventsFromRequest(body);
    const isStandby = this._isStandby(body);
    return rawEvents.map(event => new FacebookEvent(event, { isStandby }));
  }

  createContext({ event, session, initialState }) {
    return new MessengerContext({
      client: this._client,
      event,
      session,
      initialState,
    });
  }

  // https://developers.facebook.com/docs/messenger-platform/webhook#security
  verifySignature(rawBody, signature) {
    if (!this._appSecret) {
      return true;
    }
    return (
      signature ===
      `sha1=${crypto
        .createHmac('sha1', this._appSecret)
        .update(rawBody, 'utf8')
        .digest('hex')}`
    );
  }
}
