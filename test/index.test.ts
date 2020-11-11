// You can import your modules
// import index from '../src/index'

import nock from 'nock';
// Requiring our app implementation
import myProbotApp from '../src';
import { Probot, ProbotOctokit } from 'probot';
// Requiring our fixtures
import payload from './fixtures/pr.opened.json';
//import { invalidIdsCommentMock } from './fixtures/JSONMocks';
//import { getColumnsMock } from './fixtures/JSONMocks';

describe('My Probot app', () => {
  let probot: any;

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
    probot.load(myProbotApp);
  });

  test('Get Columns Query', async (done) => {
    const monday_mock = nock('https://api.monday.com/v2')
      .persist()
      .post(/.*/, () => {
        //return done(expect(req).toEqual(getColumnsMock));
        return done();
      })
      .reply(200, {
        query: {
          id: 1,
        },
      });

    const github_mock = nock('https://api.github.com').persist().post(/.*/).reply(200, {
      url: 'https://api.github.com/repos/c3duan/awesome-tool/pulls/1',
      title: 'Testing Suite',
      body: 'This is a mocked reply from github',
    });

    await probot.receive({ name: 'pull_request', payload }).catch((err: any) => {
      console.error(err);
    });

    expect(monday_mock.pendingMocks()).toBeDefined();
    expect(github_mock.pendingMocks()).toBeDefined();
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
