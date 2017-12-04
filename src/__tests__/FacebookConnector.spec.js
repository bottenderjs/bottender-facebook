import FacebookClient from '../FacebookClient';
import FacebookConnector from '../FacebookConnector';
import FacebookContext from '../FacebookContext';
import FacebookEvent from '../FacebookEvent';

jest.mock('warning');

const ACCESS_TOKEN = 'FAKE_TOKEN';
const APP_SECRET = 'FAKE_SECRET';

const request = {
  body: {
    object: 'page',
    entry: [
      {
        id: '1895382890692545',
        time: 1486464322257,
        messaging: [
          {
            sender: {
              id: '1412611362105802',
            },
            recipient: {
              id: '1895382890692545',
            },
            timestamp: 1486464322190,
            message: {
              mid: 'mid.1486464322190:cb04e5a654',
              seq: 339979,
              text: 'text',
            },
          },
        ],
      },
    ],
  },
};

const batchRequest = {
  body: {
    object: 'page',
    entry: [
      {
        id: '1895382890692545',
        time: 1486464322257,
        messaging: [
          {
            sender: {
              id: '1412611362105802',
            },
            recipient: {
              id: '1895382890692545',
            },
            timestamp: 1486464322190,
            message: {
              mid: 'mid.1486464322190:cb04e5a654',
              seq: 339979,
              text: 'test 1',
            },
          },
        ],
      },
      {
        id: '189538289069256',
        time: 1486464322257,
        messaging: [
          {
            sender: {
              id: '1412611362105802',
            },
            recipient: {
              id: '1895382890692545',
            },
            timestamp: 1486464322190,
            message: {
              mid: 'mid.1486464322190:cb04e5a656',
              seq: 339979,
              text: 'test 2',
            },
          },
        ],
      },
    ],
  },
};

const standbyRequest = {
  body: {
    object: 'page',
    entry: [
      {
        id: '<PAGE_ID>',
        time: 1458692752478,
        standby: [
          {
            sender: {
              id: '<USER_ID>',
            },
            recipient: {
              id: '<PAGE_ID>',
            },

            // FIXME: standby is still beta
            // https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/standby
            /* ... */
          },
        ],
      },
    ],
  },
};

const commentAddRequest = {
  body: {
    object: 'page',
    entry: [
      {
        id: '<PAGE_ID>',
        time: 1458692752478,
        changes: [
          {
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
              message: 'Good',
            },
          },
        ],
      },
    ],
  },
};

function setup(
  { accessToken, appSecret, mapPageToAccessToken } = {
    accessToken: ACCESS_TOKEN,
    appSecret: APP_SECRET,
    mapPageToAccessToken: jest.fn(),
  }
) {
  const mockGraphAPIClient = {
    getUserProfile: jest.fn(),
  };
  FacebookClient.connect = jest.fn();
  FacebookClient.connect.mockReturnValue(mockGraphAPIClient);
  return {
    mockGraphAPIClient,
    connector: new FacebookConnector({
      accessToken,
      appSecret,
      mapPageToAccessToken,
    }),
  };
}

describe('#mapRequestToEvents', () => {
  it('should map request to FacebookEvents', () => {
    const { connector } = setup();
    const events = connector.mapRequestToEvents(request.body);

    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(FacebookEvent);
  });

  it('should work with batch entry', () => {
    const { connector } = setup();
    const events = connector.mapRequestToEvents(batchRequest.body);

    expect(events).toHaveLength(2);
    expect(events[0]).toBeInstanceOf(FacebookEvent);
    expect(events[1]).toBeInstanceOf(FacebookEvent);
  });

  it('should map request to standby FacebookEvents', () => {
    const { connector } = setup();
    const events = connector.mapRequestToEvents(standbyRequest.body);

    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(FacebookEvent);
    expect(events[0].isStandby).toBe(true);
  });

  it('should map request to changes FacebookEvents', () => {
    const { connector } = setup();
    const events = connector.mapRequestToEvents(commentAddRequest.body);

    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(FacebookEvent);
    expect(events[0].isStandby).toBe(false);
  });

  it('should be filtered if body is not messaging or standby', () => {
    const otherRequest = {
      body: {
        object: 'page',
        entry: [
          {
            id: '<PAGE_ID>',
            time: 1458692752478,
            other: [
              {
                sender: {
                  id: '<USER_ID>',
                },
                recipient: {
                  id: '<PAGE_ID>',
                },
              },
            ],
          },
        ],
      },
    };
    const { connector } = setup();
    const events = connector.mapRequestToEvents(otherRequest.body);

    expect(events).toHaveLength(0);
  });

  it('should pass pageId when the body.object is `page`', () => {
    const { connector } = setup();
    const commentAddRequestByPage = {
      body: {
        object: 'page',
        entry: [
          {
            id: '<PAGE_ID>',
            time: 1458692752478,
            changes: [
              {
                field: 'feed',
                value: {
                  from: {
                    id: '<PAGE_ID>',
                    name: 'user',
                  },
                  item: 'comment',
                  comment_id: '139560936744456_139620233405726',
                  post_id: '137542570280222_139560936744456',
                  verb: 'add',
                  parent_id: '139560936744456_139562213411528',
                  created_time: 1511951015,
                  message: 'Good',
                },
              },
            ],
          },
        ],
      },
    };
    const events = connector.mapRequestToEvents(commentAddRequestByPage.body);
    expect(events[0].pageId).toBe('<PAGE_ID>');
    expect(events[0].isSentByPage).toBe(true);
  });
});

describe('#createContext', () => {
  it('should create MessengerContext', async () => {
    const { connector } = setup();
    const event = {
      rawEvent: {
        recipient: {
          id: 'anyPageId',
        },
      },
    };
    const session = {};

    const context = await connector.createContext({
      event,
      session,
    });

    expect(context).toBeDefined();
    expect(context).toBeInstanceOf(FacebookContext);
  });

  it('should create MessengerContext and has customAccessToken', async () => {
    const mapPageToAccessToken = jest.fn(() => Promise.resolve('anyToken'));
    const { connector } = setup({ mapPageToAccessToken });
    const event = {
      rawEvent: {
        recipient: {
          id: 'anyPageId',
        },
      },
    };
    const session = {};

    const context = await connector.createContext({
      event,
      session,
    });

    expect(context).toBeDefined();
    expect(context.accessToken).toBe('anyToken');
  });
});
