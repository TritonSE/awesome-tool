import { Application, Context } from 'probot' // eslint-disable-line no-unused-vars

export = (app: Application) => {
  app.on('issues.opened', async (context: Context) => {
    const issueComment = context.issue({ body: 'Thanks for opening this issue!' });
    await context.github.issues.createComment(issueComment)
  })

  app.on('pull_request.edited', async (context: Context) => {
    const issueComment = context.issue({ body: 'Thanks for opening this pull request!' });
    await context.github.issues.createComment(issueComment)
  })

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
