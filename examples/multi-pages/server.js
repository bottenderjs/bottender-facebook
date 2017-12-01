const { Bot } = require('bottender');
const { createServer } = require('bottender/koa');
const { FacebookConnector } = require('bottender-fb');

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
    appSecret: APP_SECRET,
    mapPageToAccessToken,
  }),
});

bot.onEvent(async context => {
  if (context.event.isCommentAdd) {
    try {
      await context.sendPrivateReply('OK!');
      await context.sendComment('Public reply!');
    } catch (err) {
      console.log(err);
    }
  }
});

const server = createServer(bot, { verifyToken: VERIFY_TOKEN });

module.exports = server;
