import api from './api.js';

const KEY_USER_ID = 'userId';
const KEY_TOKEN = 'token';

export default {
  get: function get() {
    const userId = localStorage.getItem(KEY_USER_ID);
    const token = localStorage.getItem(KEY_TOKEN);

    if (userId && token) {
      return api.findUser(userId, token)
    } else {
      return api.newUser()
        .then(user => {
          localStorage.setItem(KEY_USER_ID, user.id);
          localStorage.setItem(KEY_TOKEN, user.token);
          return user;
        });
    }
  }

};
