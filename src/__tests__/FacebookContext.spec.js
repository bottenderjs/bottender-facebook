import FacebookContext from '../FacebookContext';
import FacebookEvent from '../FacebookEvent';

jest.mock('warning');

const userRawEvent = {
  field: 'feed',
  value: {
    from: {
      id: '139560936744123',
      name: 'user',
    },
    item: 'comment',
    comment_id: '139560936744456_139620233405726',
    post_id: '137542570280222_139560936744456',
    verb: 'add',
    parent_id: '139560936744456_139562213411528',
    created_time: 1511951015,
    message: 'OK',
  },
};

const sentByPageRawEvent = {
  field: 'feed',
  value: {
    from: {
      id: '137542570280222',
      name: 'page',
    },
    item: 'comment',
    comment_id: '139560936744456_139620233405726',
    post_id: '137542570280222_139560936744456',
    verb: 'add',
    parent_id: '139560936744456_139562213411528',
    created_time: 1511951015,
    message: 'OK',
  },
};

const setup = ({ rawEvent, pageId } = { rawEvent: userRawEvent }) => {
  const client = {
    sendComment: jest.fn(),
    sendPrivateReply: jest.fn(),
    getComment: jest.fn(),
  };

  const context = new FacebookContext({
    client,
    event: new FacebookEvent(rawEvent, { pageId }),
  });
  return {
    client,
    context,
  };
};

describe('#sendComment', () => {
  it('should call client with comment id', async () => {
    const { context, client } = setup();

    await context.sendComment('Public Reply!');

    expect(client.sendComment).toBeCalledWith(
      '139560936744456_139620233405726',
      'Public Reply!',
      { access_token: undefined }
    );
  });

  it('should not reply to page itself', async () => {
    const { context, client } = setup({
      rawEvent: sentByPageRawEvent,
      pageId: '137542570280222',
    });

    await context.sendComment('Public Reply!');

    expect(client.sendComment).not.toBeCalled();
  });
});

describe('#sendPrivateReply', () => {
  it('should call client with comment id', async () => {
    const { context, client } = setup();

    await context.sendPrivateReply('OK!');

    expect(client.sendPrivateReply).toBeCalledWith(
      '139560936744456_139620233405726',
      'OK!',
      { access_token: undefined }
    );
  });

  it('should not reply to page itself', async () => {
    const { context, client } = setup({
      rawEvent: sentByPageRawEvent,
      pageId: '137542570280222',
    });

    await context.sendPrivateReply('OK!');

    expect(client.sendPrivateReply).not.toBeCalled();
  });
});

describe('#getComment', () => {
  it('should call client with comment id', async () => {
    const { context, client } = setup();

    await context.getComment();

    expect(client.getComment).toBeCalledWith(
      '139560936744456_139620233405726',
      { access_token: undefined }
    );
  });
});
