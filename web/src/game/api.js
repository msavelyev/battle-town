
const host = process.env.SERVER_HOST || window.location.origin;

function url(path) {
  return host + path;
}

export default {
  findUser: function(id, token) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id,
        token
      })
    };
    return fetch(url('/api/get'), options)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return null;
        }
      });
  },

  newUser: function() {
    return fetch(url('/api/new'))
      .then(response => response.json());
  },

  leaderboard: function(id) {
    return fetch(url(`/api/top?id=${id}`))
      .then(response => response.json());
  },

  updateName: function(id, token, name) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id,
        token,
        name
      })
    };
    return fetch(url('/api/update'), options)
      .then(response => response.json());
  },

};

