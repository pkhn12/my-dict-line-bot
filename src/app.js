import config from './config';
const Koa = require('koa');
const webhookRouter = require('./modules/webhook/webhook.route');
const logger = require('koa-logger')();


const app = new Koa();

app.use(logger);

webhookRouter(app);

app.listen(config.app.port);