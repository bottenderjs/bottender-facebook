# Bottender Facebook

[![npm](https://img.shields.io/npm/v/bottender-facebook.svg?style=flat-square)](https://www.npmjs.com/package/bottender-facebook)
[![Build Status](https://travis-ci.org/bottenderjs/bottender-facebook.svg?branch=master)](https://travis-ci.org/bottenderjs/bottender-facebook)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Facebook connector for [Bottender](https://github.com/Yoctol/bottender).

## Installation

```sh
npm install bottender-facebook
```

## Requirement

### Facebook App Graph API verion

Using the API version before `v2.10` may cause unexpected behavior.\
We highly recommend the API version after `v2.11`.

### Subscribe to essential fields

You need to make sure the webhook of your page is subscribing to the `feed` field on API version after `v2.11`.

### User Permissions Required

- **manage_pages**
- **publish_pages** - for public replies
- **read_page_mailboxes** - for private replies

## Example

```js
const { Bot } = require('bottender');
const { createServer } = require('bottender/express');
const { FacebookConnector } = require('bottender-facebook');

// We can get `story_fbid` in URL query string
const POST_ID =
  process.env.POST_ID || `${process.env.PAGE_ID}_${process.env.STORY_FBID}`;

const bot = new Bot({
  connector: new FacebookConnector({
    accessToken: process.env.ACCESS_TOKEN,
    appSecret: process.env.APP_SECRET,
  }),
});

bot.onEvent(async context => {
  if (
    context.event.isCommentAdd &&
    context.event.comment.post_id === POST_ID &&
    context.event.comment.parent_id === POST_ID
  ) {
    await context.sendPrivateReply('OK!');
    await context.sendComment('Public comment!');
  }
});

const server = createServer(bot);
```

### Custom Graph API version

The default `Graph API` version is `v2.11` (recommended). \
You can use other version by following this example:

```js
const { Bot } = require('bottender');
const { FacebookConnector, FacebookClient } = require('bottender-fb');

const bot = new Bot({
  connector: new FacebookConnector({
    appSecret: APP_SECRET,
    client: FacebookClient.connect(
      ACCESS_TOKEN,
      '2.11'
    ),
  }),
});
```

## API Reference

### Client

- `client.sendComment`
- `client.sendPrivateReply`
- `client.getComment`

### Context

- `context.sendComment`
- `context.sendPrivateReply`
- `context.getComment`

### Event

- `event.isFeed`
- `event.isStatus`
- `event.isStatusAdd`
- `event.isStatusEdited`
- `event.status`
- `event.isPost`
- `event.isPostRemove`
- `event.post`
- `event.isComment`
- `event.isCommentAdd`
- `event.isCommentEdited`
- `event.isCommentRemove`
- `event.comment`
- `event.isLike`
- `event.isLikeAdd`
- `event.isLikeRemove`
- `event.like`
- `event.isReaction`
- `event.isReactionAdd`
- `event.isReactionEdit`
- `event.isReactionRemove`
- `event.reaction`

## Contributing

Pull Requests and issue reports are welcome. You can follow steps below to
submit your pull requests:

Fork, then clone the repo:

```sh
git clone git@github.com:your-username/bottender-facebook.git
```

Install the dependencies:

```sh
cd bottender-facebook
yarn
```

Make sure the tests pass (including eslint, flow checks and jest tests):

```sh
yarn test
```

Make your changes and tests, and make sure the tests pass.

## License

MIT © [Yoctol](https://github.com/bottenderjs/bottender-facebook)
