import { Application } from 'probot'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { prHandler } from './github/handlers';

export = (app: Application) => {
  app.on(
    ['pull_request.opened', 'pull_request.edited', 'pull_request.reopened', 'pull_request.closed'],
    prHandler,
  );

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
