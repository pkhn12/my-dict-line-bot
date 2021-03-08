import crypto from 'crypto';
import config from '../config';

export default (headerSignature, body) => {
  const channelSecret = config.line.channelSecret; // Channel secret string
  const signature = crypto
    .createHmac('SHA256', channelSecret)
    .update(JSON.stringify(body)).digest('base64');
  return headerSignature === signature;
}
