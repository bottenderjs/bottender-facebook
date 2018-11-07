const { Bot } = require('bottender');
const { createServer } = require('bottender/koa');
const { FacebookConnector } = require('bottender-facebook');
const { isError613 } = require('messenger-batch');

const PAGE_1_PAGE_ID = process.env.PAGE_1_PAGE_ID;
const PAGE_1_ACCESS_TOKEN = process.env.PAGE_1_ACCESS_TOKEN;

const PAGE_2_PAGE_ID = process.env.PAGE_2_PAGE_ID;
const PAGE_2_ACCESS_TOKEN = process.env.PAGE_2_ACCESS_TOKEN;

const APP_SECRET = process.env.APP_SECRET;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

const mapPageToAccessToken = pageId => {
  switch (pageId) {
    case PAGE_1_PAGE_ID:
      return PAGE_1_ACCESS_TOKEN;
    case PAGE_2_PAGE_ID:
    default:
      return PAGE_2_ACCESS_TOKEN;
  }
};

const bot = new Bot({
  connector: new FacebookConnector({
    accessToken: PAGE_1_ACCESS_TOKEN, // Top level access token should be specified for batch request.
    appSecret: APP_SECRET,
    mapPageToAccessToken,
    batchConfig: {
      delay: 1000,
      shouldRetry: isError613, // (#613) Calls to this api have exceeded the rate limit.
      retryTimes: 2,
    },
  }),
});

bot.onEvent(async context => {
  if (context.event.isCommentAdd && !context.event.isSentByPage) {
    try {
      await context.sendPrivateReply('OK!');
      await context.sendComment('Public reply!');
      await context.sendLike();
    } catch (err) {
      console.log(err);
    }
  } else {
    await context.sendText('text..');
  }
});

const server = createServer(bot, { verifyToken: VERIFY_TOKEN });

module.exports = server;
