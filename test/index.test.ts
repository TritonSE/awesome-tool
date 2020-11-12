// You can import your modules
// import index from '../src/index'

//import nock from 'nock';
import fetchMock, { MockRequest } from 'fetch-mock';
//import fetchMock from 'fetch-mock-jest';
// Requiring our app implementation
import myProbotApp from '../src';
import { Probot, ProbotOctokit } from 'probot';
// Requiring our fixtures
import payload from './fixtures/pr.opened.json';
//import { invalidIdsCommentMock } from './fixtures/JSONMocks';
//import { getColumnsMock } from './fixtures/JSONMocks';
import { getItemsResponseMock } from './fixtures/JSONMocks';

describe('My Probot app', () => {
  let probot: any;

  beforeEach(() => {
    //nock.disableNetConnect();
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

  test('Get Columns Query', async () => {
    const mondayHeaders = {
      headers: {
        'Content-type': 'application/json',
        Authorization: '1343253',
      },
    };
    fetchMock.mock(
      (url: string, opts: MockRequest): boolean => {
        console.log('lskjdgkl;as;ldgjs;lkgj;lkasjdg;lkjs');
        console.log(
          Boolean(
            url === 'https://api.monday.com/v2' &&
              (opts?.headers as { [key: string]: string | number })?.Authorization,
          ),
        );
        return Boolean(
          url === 'https://api.monday.com/v2' &&
            (opts?.headers as { [key: string]: string | number })?.Authorization,
        );
      },
      getItemsResponseMock,
      mondayHeaders,
    );
    //fetchMock.mock(/(https:\/\/api\.github\.com\/repos)(.*)/, { hello: 'world' });

    await probot.receive({ name: 'pull_request', payload }).catch((err: any) => {
      console.error(err);
    });
    console.log(fetchMock.called());
  });

  afterEach(() => {
    //nock.cleanAll();
    //nock.enableNetConnect();
  });
});

// For more information about testing with Jest see:
// https://facebook.github.io/jest/

// For more information about using TypeScript in your tests, Jest recommends:
// https://github.com/kulshekhar/ts-jest

// For more information about testing with Nock see:
// https://github.com/nock/nock
