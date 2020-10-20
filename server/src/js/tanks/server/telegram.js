import https from 'https';
import * as dotenv from '@Lib/tanks/lib/util/dotenv.js';

function createUrl(apiKey, chatId, text) {
  text = encodeURIComponent(text);
  return `https://api.telegram.org/bot${apiKey}/sendMessage?chat_id=${chatId}&text=${text}`;
}

export default {
  sendMessage: function(text) {
    const chatId = dotenv.SETTINGS.TELEGRAM_CHAT_ID;
    const apiKey = dotenv.SETTINGS.TELEGRAM_API_KEY;

    if (!apiKey || !chatId) {
      return;
    }

    const url = createUrl(apiKey, chatId, text);
    https.get(url);
  }
};
