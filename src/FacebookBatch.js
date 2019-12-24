/* @flow */
/* eslint-disable camelcase */

import querystring from 'querystring';

function sendPrivateReply(objectId: string, message: string, options?: Object) {
  return {
    method: 'POST',
    relative_url: 'me/messages',
    body: {
      messaging_type: 'UPDATE',
      recipient: { comment_id: objectId },
      message,
      ...options,
    },
  };
}

function sendComment(
  objectId: string,
  comment:
    | string
    | {
        attachment_id?: string,
        attachment_share_url?: string,
        attachment_url?: string,
        message?: string,
      },
  options?: Object
) {
  let body;

  if (typeof comment === 'string') {
    body = {
      message: comment,
    };
  } else {
    body = comment;
  }

  return {
    method: 'POST',
    relative_url: `${objectId}/comments`,
    body: {
      ...body,
      ...options,
    },
  };
}

function sendLike(objectId: string, options?: Object) {
  return {
    method: 'POST',
    relative_url: `${objectId}/likes`,
    body: {
      ...options,
    },
  };
}

function getComment(
  commentId: string,
  {
    fields,
    access_token,
  }: { fields?: ?(Array<string> | string), access_token?: ?string } = {}
) {
  const conjunctFields = Array.isArray(fields) ? fields.join(',') : fields;

  const query = {};

  if (conjunctFields) {
    query.fields = conjunctFields;
  }

  if (access_token) {
    query.access_token = access_token;
  }

  return {
    method: 'GET',
    relative_url: `${commentId}?${querystring.stringify(query)}`,
  };
}

function getLikes(
  objectId: string,
  { summary, access_token }: { summary?: boolean, access_token?: ?string } = {}
) {
  const query = {};

  if (summary) {
    query.summary = summary;
  }

  if (access_token) {
    query.access_token = access_token;
  }

  return {
    method: 'GET',
    relative_url: `${objectId}/likes?${querystring.stringify(query)}`,
  };
}

const FacebookBatch = {
  sendPrivateReply,
  sendComment,
  sendLike,
  getComment,
  getLikes,
};

export default FacebookBatch;
