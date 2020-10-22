import { ParsedResult } from '../types';

const regexp = /board\s+id\s*:\s*(?<board_id>[0-9]+)\s*\r\n.*item\s+id\s*:\s*(?<item_id>[0-9]+)/i;

export const parseBody = (body: string): ParsedResult => {
  const match = body.match(regexp)?.groups;

  return {
    board_id: match?.board_id ? parseInt(match.board_id) : undefined,
    item_id: match?.item_id ? parseInt(match.item_id) : undefined,
  };
};
