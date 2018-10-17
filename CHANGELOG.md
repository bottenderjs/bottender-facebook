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
