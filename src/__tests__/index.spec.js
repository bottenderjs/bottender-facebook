import { FacebookConnector, FacebookEvent } from '../';

it('should export public api', () => {
  expect(FacebookConnector).toBeDefined();
  expect(FacebookEvent).toBeDefined();
});
