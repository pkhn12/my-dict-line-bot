import HttpStatus from 'http-status-codes';
import { validateSignature } from '../../utils'
import WebhookService from '../../services/webhook.service';

const webhookService = new WebhookService();

const healthCheck = async (ctx) => {
  try {
    ctx.status = HttpStatus.OK;
    ctx.body = 'OK';
  } catch (e) {
    throw e;
  }
}

const hook = async (ctx) => {
  try {
    const lineSignature = ctx.header['x-line-signature'];
    const body = ctx.request.body;
    if(!validateSignature(lineSignature, body)) {
      ctx.status = HttpStatus.BAD_REQUEST;
      ctx.body = 'Bad signature';
      return;
    }
    await webhookService.hookAction(body);
    ctx.status = HttpStatus.OK;
    ctx.body = 'OK';
  } catch (e) {
    throw e;
  }
}

module.exports = { healthCheck, hook }