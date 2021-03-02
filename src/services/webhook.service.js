import { isEnglish } from '../utils'

const hookAction = async (body) => {
  const events = body.events;
  events.map((event) => {
    if (event.type === 'message') {
      console.log(event.message);
      console.log(isEnglish(event.message));
    }
  });
};

module.exports = {
  hookAction
};