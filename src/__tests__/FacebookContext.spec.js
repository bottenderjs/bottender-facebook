import FacebookContext from '../FacebookContext';
import FacebookEvent from '../FacebookEvent';

const rawEvent = {
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

const setup = () => {
  const client = {
    sendComment: jest.fn(),
    sendPrivateReply: jest.fn(),
  };

  const context = new FacebookContext({
    client,
    event: new FacebookEvent(rawEvent),
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
});
