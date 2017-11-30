# Bottender FB

> Facebook connector for [Bottender](https://github.com/Yoctol/bottender).

[![npm](https://img.shields.io/npm/v/bottender-fb.svg?style=flat-square)](https://www.npmjs.com/package/bottender-fb)
[![Build Status](https://travis-ci.org/bottenderjs/bottender-fb.svg?branch=master)](https://travis-ci.org/bottenderjs/bottender-fb)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```sh
npm install bottender-fb
```

## Requirement

### User Permissions Required

* **manage_pages** - for access token
* **publish_pages** - for public replies
* **read_page_mailboxes** - for private replies

## Example

```js
const { Bot } = require('bottender');
const { createServer } = require('bottender/express');
const { FacebookConnector } = require('bottender-fb');

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
  if (context.event.isCommentAdd && context.event.comment.post_id === POST_ID) {
    await context.sendPrivateReply('OK!');
    await context.sendComment('Public comment!');
  }
});

const server = createServer(bot);
```

## API Reference

### Client

* `client.sendComment`
* `client.sendPrivateReply`

### Event

* `event.isFeed`
* `event.isStatus`
* `event.isStatusAdd`
* `event.isStatusEdited`
* `event.status`
* `event.isPost`
* `event.isPostRemove`
* `event.post`
* `event.isComment`
* `event.isCommentAdd`
* `event.isCommentEdited`
* `event.isCommentRemove`
* `event.comment`
* `event.isLike`
* `event.isLikeAdd`
* `event.isLikeRemove`
* `event.like`
* `event.isReaction`
* `event.isReactionAdd`
* `event.isReactionEdit`
* `event.isReactionRemove`
* `event.reaction`

## Contributing

Pull Requests and issue reports are welcome. You can follow steps below to
submit your pull requests:

Fork, then clone the repo:

```sh
git clone git@github.com:your-username/bottender-fb.git
```

Install the dependencies:

```sh
cd bottender-fb
yarn
```

Make sure the tests pass (including eslint, flow checks and jest tests):

```sh
yarn test
```

Make your changes and tests, and make sure the tests pass.

## License

MIT © [Yoctol](https://github.com/bottenderjs/bottender-fb)
