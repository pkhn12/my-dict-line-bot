import { validateSignature } from '../../utils'
const HttpStatus = require('http-status-codes');
const hookService = require('../../services/webhook.service')

const healthCheck = async (ctx) => {
  try {
    ctx.status = HttpStatus.StatusCodes.OK;
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
      ctx.status = HttpStatus.StatusCodes.BAD_REQUEST;
      ctx.body = 'Bad signature';
      return;
    }
    await hookService.hookAction(body);
    ctx.status = HttpStatus.StatusCodes.OK;
    ctx.body = 'OK';
  } catch (e) {
    throw e;
  }
}

module.exports = { healthCheck, hook }