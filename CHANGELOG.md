# 0.6.1 / 2018-11-08

- [deps] update `messaging-api-messenger`

# 0.6.0 / 2018-11-08

- [new] add `skipAppSecretProof` and `origin` support:

```js
const bot = new Bot({
  connector: new FacebookConnector({
    accessToken: ACCESS_TOKEN,
    appSecret: APP_SECRET,
    origin: 'https://mydummytestserver.com',
    skipAppSecretProof: true,
  }),
});
```

- [new] add batch support:

```js
const { isError613 } = require('messenger-batch');

const bot = new Bot({
  connector: new FacebookConnector({
    accessToken: ACCESS_TOKEN,
    appSecret: APP_SECRET,
    batchConfig: {
      delay: 1000,
      shouldRetry: isError613, // (#613) Calls to this api have exceeded the rate limit.
      retryTimes: 2,
    },
  }),
});
```

For multiple pages, top level access token should be specified for batch request:

```js
const bot = new Bot({
  connector: new FacebookConnector({
    accessToken: ACCESS_TOKEN,
    appSecret: APP_SECRET,
    mapPageToAccessToken,
    batchConfig: {
      delay: 1000,
      shouldRetry: isError613, // (#613) Calls to this api have exceeded the rate limit.
      retryTimes: 2,
    },
  }),
});
```

# 0.5.1 / 2018-10-31

- [fix] fix FacebookConnector class property initialization.

# 0.5.0 / 2018-10-30

- [breaking] Upgrade default graph api version to `3.2`
- [new] rewrite `FacebookClient` to accept custom `origin` url (#54):

```js
const { Bot } = require('bottender');
const { FacebookConnector, FacebookClient } = require('bottender-facebook');

const bot = new Bot({
  connector: new FacebookConnector({
    appSecret: APP_SECRET,
    client: FacebookClient.connect({
      accessToken: ACCESS_TOKEN,
      version: '3.2',
      origin: 'https://mydummytestserver.com',
    }),
  }),
});
```

# 0.4.3 / 2018-10-17

- [new]`client.sendComment(objectId, comment)` - support attachment as comment:

```js
await client.sendComment('<object_id>', 'ok!'); // send as text message
await client.sendComment('<object_id>', { message: 'ok!' });
await client.sendComment('<object_id>', { attachment_id: '<attachment_id>' });
await client.sendComment('<object_id>', {
  attachment_share_url: 'https://example.com/img.gif',
});
await client.sendComment('<object_id>', {
  attachment_url: 'https://example.com/img.jpg',
});
```

- [new] `context.sendComment(comment)` - support attachment as comment:

```js
await context.sendComment('ok!'); // send as text message
await context.sendComment({ message: 'ok!' });
await context.sendComment({ attachment_id: '<attachment_id>' });
await context.sendComment({
  attachment_share_url: 'https://example.com/img.gif',
});
await context.sendComment({ attachment_url: 'https://example.com/img.jpg' });
```

# 0.4.2 / 2018-09-11

- [new] add fields support to `getComment` #47
- [new] implement `client.sendLike`, `context.sendLike` #46

```js
client.sendLike();
context.sendLike();
```

- [fix] context.canReplyPrivately
- [fix] send comment to correct layer of comments

# 0.4.1 / 2018-09-10

- [new] add new getter and api methods:

```js
event.isFirstLayerComment;

client.getComment(commentId);
client.getLikes(objectId);

context.getComment();
context.getLikes();
await context.canReplyPrivately;
```

# 0.4.0 / 2018-09-10

- [new] Bump deps

```
bottender: ^0.15.6
messaging-api-messenger: ^0.7.6
```

# 0.4.0-beta / 2018-05-30

- [new] Bump deps

```
bottender: ^0.15.0-beta.10
messaging-api-messenger: ^0.7.1
```

- [changed] Add verify token to connector (#38)

# 0.3.4 / 2018-01-17

- [changed] Use event `pageId` getter and remove `_getRawEventsFromRequest` (#30)

# 0.3.3 / 2018-01-16

- [new] Throw error when not get postId (#26)
- [new] Bump deps

```
bottender: ^0.14.16
messaging-api-messenger: ^0.6.9
```

- [changed] Remove breaking flowconfig change (#27)

# 0.3.2 / 2017-12-14

- [new] Rename package to `bottender-facebook`
- [fix] Use get page fields=access_token to retrieve access_token (#20)

# 0.3.1 / 2017-12-05

- [new] Add `event.isSentByPage`
- [fix] Prevent from calling `sendPrivateReply`, `sendComment` to page itself

# 0.3.0 / 2017-12-01

- [new] Export `FacebookClient`, `FacebookContext`, `FacebookEvent`
- [new] Add multiple pages support via `mapPageToAccessToken`

# 0.2.1 / 2017-11-29

- [fix] Fixed some bugs to support Bottender 0.14

```

```
