import { ParsedResult, PullRequest } from '../types';

const boardIdRegexp = /board\s+id\s*:\s*(?<board_id>[0-9]+)/i;
const itemIdRegexp = /.*\/.*\/(?<item_id>[0-9]+)-/i;

export const parseResult = (pullRequest: PullRequest): ParsedResult => {
  const board_id = parseBoardId(pullRequest.body);
  const item_id = parseItemId(pullRequest.head.ref);

  return {
    board_id: board_id ? parseInt(board_id) : undefined,
    item_id: item_id ? parseInt(item_id) : undefined,
  };
};

const parseBoardId = (body: string): string | undefined => {
  const match = body.match(boardIdRegexp)?.groups;

  return match?.board_id;
};

const parseItemId = (branchName: string): string | undefined => {
  const match = branchName.match(itemIdRegexp)?.groups;

  return match?.item_id;
};
