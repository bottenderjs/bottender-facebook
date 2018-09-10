import MockAdapter from 'axios-mock-adapter';

import FacebookClient from '../FacebookClient';

const OBJECT_ID = '123456';
const COMMENT_ID = '123456';
const ACCESS_TOKEN = '1234567890';
const ANOTHER_TOKEN = '0987654321';

const createMock = () => {
  const client = new FacebookClient(ACCESS_TOKEN);
  const mock = new MockAdapter(client.axios);
  return { client, mock };
};

describe('#axios', () => {
  it('should return underlying http client', () => {
    const client = new FacebookClient(ACCESS_TOKEN);
    expect(client.axios.get).toBeDefined();
    expect(client.axios.post).toBeDefined();
    expect(client.axios.put).toBeDefined();
    expect(client.axios.delete).toBeDefined();
  });
});

describe('send api', () => {
  describe('#sendPrivateReply', () => {
    it('should call private_replies api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost(`/${OBJECT_ID}/private_replies?access_token=${ACCESS_TOKEN}`, {
          message: 'Hello!',
        })
        .reply(200, reply);

      const res = await client.sendPrivateReply(OBJECT_ID, 'Hello!');

      expect(res).toEqual(reply);
    });

    it('support custom token', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost(`/${OBJECT_ID}/private_replies?access_token=${ANOTHER_TOKEN}`, {
          message: 'Hello!',
        })
        .reply(200, reply);

      const res = await client.sendPrivateReply(OBJECT_ID, 'Hello!', {
        access_token: ANOTHER_TOKEN,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#sendComment', () => {
    it('should call comments api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost(`/${OBJECT_ID}/comments?access_token=${ACCESS_TOKEN}`, {
          message: 'Hello!',
        })
        .reply(200, reply);

      const res = await client.sendComment(OBJECT_ID, 'Hello!');

      expect(res).toEqual(reply);
    });

    it('support custom token', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onPost(`/${OBJECT_ID}/comments?access_token=${ANOTHER_TOKEN}`, {
          message: 'Hello!',
        })
        .reply(200, reply);

      const res = await client.sendComment(OBJECT_ID, 'Hello!', {
        access_token: ANOTHER_TOKEN,
      });

      expect(res).toEqual(reply);
    });
  });

  describe('#getComment', () => {
    it('should call comments api', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onGet(`/${COMMENT_ID}?access_token=${ACCESS_TOKEN}`)
        .reply(200, reply);

      const res = await client.getComment(COMMENT_ID);

      expect(res).toEqual(reply);
    });

    it('support custom token', async () => {
      const { client, mock } = createMock();

      const reply = {};

      mock
        .onGet(`/${COMMENT_ID}?access_token=${ANOTHER_TOKEN}`)
        .reply(200, reply);

      const res = await client.getComment(COMMENT_ID, {
        access_token: ANOTHER_TOKEN,
      });

      expect(res).toEqual(reply);
    });
  });
});
