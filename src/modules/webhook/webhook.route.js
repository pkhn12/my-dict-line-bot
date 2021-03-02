const router = require('koa-joi-router');
const ctrlWebhook = require('./webhook.controller');


const webhookRouter = (app) => {
  const __  = router();
  __.route(
    [
      {
        method: 'get',
        path: '/webhook',
        handler: ctrlWebhook.healthCheck
      },
      {
        method: 'post',
        path: '/webhook',
        handler: ctrlWebhook.hook,
        validate: { type: 'json' },
      }
    ]
  );
  app.use(__.middleware());
};

module.exports = webhookRouter;