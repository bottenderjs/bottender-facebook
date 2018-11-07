const { Bot } = require('bottender');
const { createServer } = require('bottender/koa');
const { FacebookConnector } = require('bottender-facebook');

require('dotenv').config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const APP_SECRET = process.env.APP_SECRET;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

const bot = new Bot({
  connector: new FacebookConnector({
    accessToken: ACCESS_TOKEN,
    appSecret: APP_SECRET,
  }),
});

bot.onEvent(async context => {
  console.log(context.event);

  if (context.event.isCommentAdd && !context.event.isSentByPage) {
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
