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
import mondayMutationResponseMock from './fixtures/monday.mutation.json';
import failedItemsResponseMock from './fixtures/invalidMondayID.json';
// import individual functions/queries for testing
import { parseResult } from '../src/github/parser';
import { mondayClient } from '../src/monday/client';
import { getItems } from '../src/monday/queries';
import { PullRequest } from '../src/types';

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

  test('Test Board ID/Item ID Parsing', () => {
    // expected results from parseResult function
    const expectedValidParsedPullRequest = {
      board_id: 785685546,
      item_id: 123785546,
    };

    const expectedInavlidParsedBoardID = {
      board_id: undefined,
      item_id: 123785546,
    };

    const expectedInvalidParsedItemID = {
      board_id: 785685546,
      item_id: undefined,
    };

    const expectedInvalidParsedPullRequest = {
      board_id: undefined,
      item_id: undefined,
    };

    // simulated PullRequest JSON to parse
    const validPullRequest: PullRequest = payload.pull_request;

    const invalidBoardIDPullRequest: PullRequest = {
      body:
        '### Administrative Info\r\nMonday Board ID: jsag0sgd\r\nMake sure your branch name conforms to: `<feature/staging/hotfix/...>/[username]/[Monday Item ID]-[3-4 word description separated by dashes]`.\r\nOtherwise, please rename your branch and create a new PR.\r\n\r\n### Changes\r\nWhat changes did you make?\r\n- TODO\r\n\r\n### Testing\r\nHow did you confirm your changes worked?\r\n- TODO\r\n\r\n### Confirmation of Change\r\nUpload a screenshot, if possible. Otherwise, please provide instructions on how to see the change.\r\n\r\n| [TODO Screenshot Title] |\r\n| --- |\r\n| [TODO Screenshot Link] |',
      head: {
        label: 'TestUser:feature/TestUser/12345678-patch-41',
        ref: 'feature/TestUser/123785546-invalid-id-for-test',
        sha: '87ade3a8c4e177edbb07d7b682dfea473cad0975',
      },
    };

    const invalidItemIDPullRequest: PullRequest = {
      body:
        '### Administrative Info\r\nMonday Board ID: 785685546\r\nMake sure your branch name conforms to: `<feature/staging/hotfix/...>/[username]/[Monday Item ID]-[3-4 word description separated by dashes]`.\r\nOtherwise, please rename your branch and create a new PR.\r\n\r\n### Changes\r\nWhat changes did you make?\r\n- TODO\r\n\r\n### Testing\r\nHow did you confirm your changes worked?\r\n- TODO\r\n\r\n### Confirmation of Change\r\nUpload a screenshot, if possible. Otherwise, please provide instructions on how to see the change.\r\n\r\n| [TODO Screenshot Title] |\r\n| --- |\r\n| [TODO Screenshot Link] |',
      head: {
        label: 'TestUser:feature/TestUser/12345678-patch-41',
        ref: 'feature/TestUser/invalid192tID32-invalid-id-for-test',
        sha: '87ade3a8c4e177edbb07d7b682dfea473cad0975',
      },
    };

    const invalidItemAndBoardIDPullRequest: PullRequest = {
      body:
        '### Administrative Info\r\nMonday Board ID: b4db04rd1d\r\nMake sure your branch name conforms to: `<feature/staging/hotfix/...>/[username]/[Monday Item ID]-[3-4 word description separated by dashes]`.\r\nOtherwise, please rename your branch and create a new PR.\r\n\r\n### Changes\r\nWhat changes did you make?\r\n- TODO\r\n\r\n### Testing\r\nHow did you confirm your changes worked?\r\n- TODO\r\n\r\n### Confirmation of Change\r\nUpload a screenshot, if possible. Otherwise, please provide instructions on how to see the change.\r\n\r\n| [TODO Screenshot Title] |\r\n| --- |\r\n| [TODO Screenshot Link] |',
      head: {
        label: 'TestUser:feature/TestUser/12345678-patch-41',
        ref: 'feature/TestUser/invalid192tID32-invalid-id-for-test',
        sha: '87ade3a8c4e177edbb07d7b682dfea473cad0975',
      },
    };

    expect(parseResult(validPullRequest)).toEqual(expectedValidParsedPullRequest);
    expect(parseResult(invalidBoardIDPullRequest)).toEqual(expectedInavlidParsedBoardID);
    expect(parseResult(invalidItemIDPullRequest)).toEqual(expectedInvalidParsedItemID);
    expect(parseResult(invalidItemAndBoardIDPullRequest)).toEqual(expectedInvalidParsedPullRequest);
  });

  test('Test Monday Client Get Items is a success', async () => {
    fetchMock.mockIf('https://api.monday.com/v2', JSON.stringify(itemsResponseMock));
    const mondayResponse = await mondayClient(getItems, {
      item_ids: [12345678],
    });

    expect(mondayResponse).toEqual(itemsResponseMock);
  });

  test('Test Monday Client Item ID is Invalid', async () => {
    fetchMock.mockIf('https://api.monday.com/v2', JSON.stringify(failedItemsResponseMock));
    const mondayResponse = await mondayClient(getItems, {
      item_ids: [-102352532],
    });

    expect(mondayResponse.data.items.length).toEqual(0);
  });

  test('Pull Request Handler Successfully', async () => {
    fetchMock
      .mockOnceIf('https://api.monday.com/v2', JSON.stringify(itemsResponseMock))
      .mockOnceIf('https://api.monday.com/v2', JSON.stringify(mondayMutationResponseMock));

    // fetchMock won't intercept fetch w/ api.github.com but nock will
    nock('https://api.github.com')
      .persist()
      .post(/repos\/hiimbex\/testing-things\/issues\/112\/comments/, (request) => {
        expect(request.body).toBe(
          'This PR is linked to [Item 123785546](/boards/785685546/pulses/123785546) on [Board 785685546](/boards/785685546) and has now been put into Code Review status!',
        );
        return true;
      })
      .reply(200)
      .post(
        /repos\/hiimbex\/testing-things\/statuses\/87ade3a8c4e177edbb07d7b682dfea473cad0975/,
        (request) => {
          expect(request.description).toBe('Ready to be merged');
          return true;
        },
      )
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
