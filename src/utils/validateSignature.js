const crypto = require('crypto');

export default (headerSignature, body) => {
  console.log(headerSignature, body)
  const channelSecret = process.env.CHANNEL_SECRET; // Channel secret string
  const signature = crypto
    .createHmac('SHA256', channelSecret)
    .update(JSON.stringify(body)).digest('base64');
  return headerSignature === signature;
}
