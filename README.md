# Bottender FB

> Facebook connector for Bottender.

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
const POST_ID = process.env.POST_ID || `${process.env.PAGE_ID}_${process.env.STORY_FBID}`;

const bot = new Bot({
  connector: new FacebookConnector({
    accessToken: process.env.ACCESS_TOKEN,
    appSecret: process.env.APP_SECRET,
  }),
});

bot.onEvent(async context => {
  if (context.event.isCommentAdd && context.event.comment.post_id === POST_ID) {
    const commentId = context.event.rawEvent.value.comment_id;

    await context.client.sendPrivateReply(commentId, 'OK!');
  }
});

const server = createServer(bot);
```

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

MIT © [Yoctol](https://github.com/Yoctol/bottender-fb)
