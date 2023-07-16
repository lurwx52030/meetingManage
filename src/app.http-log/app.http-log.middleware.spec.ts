import { AppHttpLogMiddleware } from './app.http-log.middleware';

describe('AppHttpLogMiddleware', () => {
  it('should be defined', () => {
    expect(new AppHttpLogMiddleware()).toBeDefined();
  });
});
