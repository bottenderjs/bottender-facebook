const { Bot } = require('bottender');
const { createServer } = require('bottender/koa');
const { FacebookConnector } = require('bottender-fb');

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const APP_SECRET = process.env.APP_SECRET;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const POST_ID = process.env.POST_ID;

const bot = new Bot({
  connector: new FacebookConnector({
    accessToken: ACCESS_TOKEN,
    appSecret: APP_SECRET,
  }),
});

bot.onEvent(async context => {
  if (context.event.isCommentAdd && context.event.comment.post_id === POST_ID) {
    const commentId = context.event.rawEvent.value.comment_id;

    try {
      await context.client.sendPrivateReply(commentId, 'OK!');
    } catch (err) {
      console.log(err.response.data);
    }
  }
});

const server = createServer(bot, { verifyToken: VERIFY_TOKEN });

module.exports = server;
