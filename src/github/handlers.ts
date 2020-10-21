import { Context } from 'probot';
import { mondayClient } from '../monday/client';
import { changeItemStatus, getColumns } from '../monday/queries';
import { Column, ParsedResult } from '../types';
import { parseBody } from './parser';

const WORKSPACE_URL = process.env['MONDAY_WORKSPACE_URL'] || '';

const updateItemStatus = async (context: Context, parsedResult: ParsedResult, status: string) => {
  const columnsResponse = await mondayClient(getColumns, { board_ids: [parsedResult.board_id] });

  const columns: [Column] = columnsResponse.data.boards.columns;
  const codeReviewColumn = columns.find((column) => column.title.toLocaleLowerCase() === 'status');

  await mondayClient(changeItemStatus, {
    ...parsedResult,
    column_id: codeReviewColumn?.id,
    value: status,
  });

  const boardLink = `${WORKSPACE_URL}/boards/${parsedResult.board_id}`;
  const itemLink = `${boardLink}/pulses/${parsedResult.item_id}`;
  const issueComment = context.issue({
    body: `
      This PR is linked to (Task ${parsedResult.item_id})[${itemLink}] on 
      (Board ${parsedResult.board_id})[${boardLink}] and has now been put 
      into Code Review status
    `,
  });
  await context.github.issues.createComment(issueComment);
};

export const prHandler = async (context: Context) => {
  try {
    const { changes, pull_request: pullRequest } = context.payload;

    if (!changes?.body) {
      return;
    }

    const parsedResult = parseBody(pullRequest.body);

    if (!(parsedResult.board_id && parsedResult.item_id)) {
      throw new Error('Missing required Monday.com IDs in description!');
    }

    await updateItemStatus(context, parsedResult, 'Code Review');
  } catch (error) {
    console.error(error);
    const issueComment = context.issue({
      body: 'Please provide valid Monday.com IDs in description!',
    });
    await context.github.issues.createComment(issueComment);
  }
};
