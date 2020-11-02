import { Context } from 'probot';
import { mondayClient } from '../monday/client';
import { changeItemStatus, getColumns } from '../monday/queries';
import { Column, ParsedResult } from '../types';
import { parseBody } from './parser';

const APP_URL = process.env['APP_URL'] || '';
const APP_NAME = process.env['APP_NAME'] || '';
const WORKSPACE_URL = process.env['MONDAY_WORKSPACE_URL'] || '';

const updateItemStatus = async (context: Context, parsedResult: ParsedResult, status: string) => {
  const columnsResponse = await mondayClient(getColumns, { board_ids: [parsedResult.board_id] });

  const columns: [Column] = columnsResponse.data.boards[0].columns;
  const codeReviewColumn = columns.find((column) => column.title.toLocaleLowerCase() === 'status');

  const updateResponse = await mondayClient(changeItemStatus, {
    ...parsedResult,
    column_id: codeReviewColumn?.id,
    value: status,
  });

  if (updateResponse.error) {
    throw new Error(updateResponse.error.message);
  }

  const boardLink = `${WORKSPACE_URL}/boards/${parsedResult.board_id}`;
  const itemLink = `${boardLink}/pulses/${parsedResult.item_id}`;
  const issueComment = context.issue({
    body: `This PR is linked to [Task ${parsedResult.item_id}](${itemLink}) on [Board ${parsedResult.board_id}](${boardLink}) and has now been put into ${status} status!`,
  });

  await context.github.issues.createComment(issueComment);
};

const updatePRStatus = async (context: Context, commitSha: string, block = false) => {
  const status = block ? 'failure' : 'success';

  await context.github.repos.createCommitStatus(
    context.repo({
      sha: commitSha,
      state: status,
      target_url: APP_URL,
      description: block ? 'Missing required Monday.com IDs in description!' : 'Ready to be merged',
      context: APP_NAME,
    }),
  );
};

export const prHandler = async (context: Context) => {
  try {
    const { changes, pull_request: pullRequest } = context.payload;

    // pull_request.edited: if the pull request's body is not edited, return early
    if (changes && !changes.body) {
      return;
    }

    const parsedResult = parseBody(pullRequest.body);

    if (!(parsedResult.board_id && parsedResult.item_id)) {
      throw new Error('Missing required Monday.com IDs in description!');
    }

    let status = 'Code Review';

    if (pullRequest.merged) {
      status = 'Done';
    }

    await updateItemStatus(context, parsedResult, status);
    await updatePRStatus(context, pullRequest.head.sha);
  } catch (error) {
    console.error(error);

    const { pull_request: pullRequest } = context.payload;
    const issueComment = context.issue({
      body: 'Please provide valid Monday.com IDs in description!',
    });

    await context.github.issues.createComment(issueComment);
    await updatePRStatus(context, pullRequest.head.sha, true);
  }
};
