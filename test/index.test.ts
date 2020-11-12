//import node-fetch mock for jest
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();
//import nock from 'nock';
import nock from 'nock';
// Requiring our app implementation
import awesomeTool from '../src';
import { Probot, ProbotOctokit } from 'probot';
// Requiring our fixtures
import payload from './fixtures/pr.opened.json';
import itemsResponseMock from './fixtures/monday.items.json';

describe('My Probot app', () => {
  let probot: Probot;

  beforeEach(() => {
    nock.disableNetConnect();
    probot = new Probot({
      id: 123,
      githubToken: 'test',
      // disable request throttling and retries for testing
      Octokit: ProbotOctokit.defaults({
        retry: { enabled: false },
        throttle: { enabled: false },
      }),
    });
    // Load our app into probot
    probot.load(awesomeTool);
  });

  test('Get Items Query', async () => {
    fetchMock.mockIf('https://api.monday.com/v2', JSON.stringify(itemsResponseMock));

    nock('https://api.github.com')
      .post('/app/installations/2/access_tokens')
      .reply(200, { token: 'test' });

    // Test that a comment is posted
    nock('https://api.github.com')
      .post('/repos/hiimbex/testing-things/issues/112/comments')
      .reply(200);

    nock('https://api.github.com')
      .post('/repos/hiimbex/testing-things/statuses/87ade3a8c4e177edbb07d7b682dfea473cad0975')
      .reply(200);

    await probot
      .receive({ id: '1', name: 'pull_request', payload })
      .catch((e: any) => console.error(e));
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });
});

// For more information about testing with Jest see:
// https://facebook.github.io/jest/

// For more information about using TypeScript in your tests, Jest recommends:
// https://github.com/kulshekhar/ts-jest

// For more information about testing with Nock see:
// https://github.com/nock/nock
