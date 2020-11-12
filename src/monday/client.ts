import fetch, { Headers } from 'node-fetch';
import { Response } from '../types';

const BASE_URL = 'https://api.monday.com/v2';

export const mondayClient = async (query: string, variables?: any): Promise<Response> => {
  const requestHeaders: Headers = new Headers({
    'Content-type': 'application/json',
    Authorization: process.env['MONDAY_API_KEY'] || '',
  });

  const response: Response = await fetch(BASE_URL, {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify({
      query,
      variables: JSON.stringify(variables),
    }),
  }).then((res) => res.json());

  if (response.error) {
    throw new Error(response.error.message);
  }
  console.log(response);

  return response;
};
