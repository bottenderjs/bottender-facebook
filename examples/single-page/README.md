# Single Page

## Install and Run

Download this example or clone [bottender-fb](https://github.com/bottenderjs/bottender-fb).

```
curl https://codeload.github.com/bottenderjs/bottender-fb/tar.gz/master | tar -xz --strip=2 bottender-fb-master/examples/single-page
cd single-page
npm install
npm run dev
```

You should fill your ACCESS_TOKEN, APP_SECRET, VERIFY_TOKEN, POST_ID in `server.js` before run your bot.

> Note: `POST_ID` is in the form of `${page_id}_${story_fbid}` and we can get `story_fbid` in URL query string.  
`ACCESS_TOKEN` must have the following permission.

### User Permissions Required

Make sure your access token has the following permission.

* **manage_pages** - for access token
* **publish_pages** - for public replies
* **read_page_mailboxes** - for private replies

## Subscribe page feed

There are two methods to subscribe page feed:

1. You can subscribe page feed at `developer app page` -> `Webhooks` -> `Page`.
    And subscribe the `feed` and `message` fields.
2. Or you can just run `npm run subscribe`.

> Note: If you choose the 2nd method, make sure all your env in `subscribe.js` are well configured.

You can check the token permission at [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken) `scopes` field.
