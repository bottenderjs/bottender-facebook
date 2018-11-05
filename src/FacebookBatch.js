function sendPrivateReply(objectId: string, message: string) {
  return {
    method: 'POST',
    relative_url: `${objectId}/private_replies`,
    body: {
      message,
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
      }
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
    body,
  };
}

function sendLike(objectId: string) {
  return {
    method: 'POST',
    relative_url: `${objectId}/likes`,
  };
}

function getComment(
  commentId: string,
  { fields }: { fields?: ?(Array<string> | string) } = {}
) {
  const conjunctFields = Array.isArray(fields) ? fields.join(',') : fields;
  const fieldsQuery = conjunctFields ? `fields=${conjunctFields}` : '';

  return {
    method: 'GET',
    relative_url: `${commentId}?${fieldsQuery}`,
  };
}

function getLikes(objectId: string, { summary }: { summary?: boolean } = {}) {
  return {
    method: 'GET',
    relative_url: `${objectId}/likes?${summary ? 'summary=true' : ''}`,
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
