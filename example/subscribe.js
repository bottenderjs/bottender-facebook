const axios = require('axios');

const USER_TOKEN = process.env.USER_TOKEN;
const PAGE_ID = process.env.PAGE_ID;

const APP_ID = process.env.APP_ID;
const APP_SECRET = process.env.APP_SECRET;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

/**
 * https://developers.facebook.com/docs/facebook-login/access-tokens/?locale=zh_TW#pagetokens
 *
 * user token + id => page token
 *
 * Permissions:
 * manage_pages - for access token
 * publish_pages - for public replies
 * read_page_mailboxes - for private replies
 */
async function generatePageToken({ userToken, pageId }) {
  const { data } = await axios.get(
    `https://graph.facebook.com/me/accounts?access_token=${userToken}`
  );
  return data.data.find(item => item.id == pageId);
}

/**
 * Tokens：https://developers.facebook.com/docs/facebook-login/access-tokens/#pagetokens
 * Page fields：https://developers.facebook.com/docs/graph-api/reference/page/
 */
async function subscribe({ appId, appSecret, verifyToken, url, fields = [] }) {
  return axios.post(`https://graph.facebook.com/${appId}/subscriptions`, {
    object: 'page',
    callback_url: url,
    fields: fields.join(','),
    verify_token: verifyToken,
    access_token: `${appId}|${appSecret}`,
  });
}

// https://developers.facebook.com/docs/graph-api/reference/page/subscribed_apps
//
// App subscribe page
async function subscribedApp({ pageId, pageToken }) {
  return axios.post(
    `https://graph.facebook.com/${pageId}/subscribed_apps?access_token=${pageToken}`
  );
}

(async function() {
  try {
    const page = await generatePageToken({
      userToken: USER_TOKEN,
      pageId: PAGE_ID,
    });

    console.log(page.access_token);

    await subscribe({
      appId: APP_ID,
      appSecret: APP_SECRET,
      url: WEBHOOK_URL,
      verifyToken: VERIFY_TOKEN,
      fields: ['messages', 'feed'],
    });

    await subscribedApp({ pageId: PAGE_ID, pageToken: page.access_token });
  } catch (err) {
    console.log(err.response.data.error);
  }
})();
