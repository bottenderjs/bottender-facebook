const { Bot } = require('bottender');
const { createServer } = require('bottender/koa');
const { FacebookConnector } = require('bottender-facebook');
const { isError613 } = require('messenger-batch');

require('dotenv').config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const APP_SECRET = process.env.APP_SECRET;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const POST_ID = process.env.POST_ID;

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

bot.onEvent(async context => {
  console.log(context.event);

  if (
    context.event.isCommentAdd &&
    context.event.comment.post_id === POST_ID &&
    !context.event.isSentByPage
  ) {
    try {
      await context.sendPrivateReply('OK!');
      await context.sendComment('Public Reply!');
      await context.sendLike();
    } catch (err) {
      console.log(err.response.data);
    }
  }
});

const server = createServer(bot, { verifyToken: VERIFY_TOKEN });

module.exports = server;
