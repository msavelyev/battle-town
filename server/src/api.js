import {v4 as uuid} from 'uuid';
import log from '../../lib/src/util/log.js';
import database from './database.js';
import telegram from './telegram.js';
import username from './username.js';

import express from 'express';

function handleErrors(fn) {
  return (req, res) => {
    try {
      fn(req, res);
    } catch (err) {
      log.error(err);
      res.status(500).json(err);
    }
  };
}

export function init(db, expressApp) {
  expressApp.use(express.json());

  expressApp.use((err, req, res, next) => {
    if (err) {
      log.error(err);
      res.status(500).json(err);
      return;
    }

    next();
  });

  expressApp.get('/api/new', handleErrors((req, res) => {
    const user = database.createUser(db, uuid(), username.generate(), uuid());
    telegram.sendMessage('new user created ' + user.id);
    log.info('created', user);
    res.json(user);
  }));

  expressApp.post('/api/get', handleErrors((req, res) => {
    const body = req.body;
    const user = database.findUser(db, body.id, body.token);

    if (!user) {
      res.status(404).end();
    } else {
      telegram.sendMessage('user logged in ' + user.id + ', ' + user.name);

      res.json(user);
    }
  }));

  expressApp.get('/api/top', handleErrors((req, res) => {
    const id = req.query.id;
    const top = database.leaderboard(db, id);

    res.json(top);
  }));

  expressApp.post('/api/update', handleErrors((req, res) => {
    const user = req.body;
    const name = user.name.trim();
    const id = user.id;
    const token = user.token;

    telegram.sendMessage('user updated name ' + user.id + ', ' + user.name);

    if (!username.validate(user.name)) {
      return res.status(400)
        .json({
          success: false,
          msg: 'Username length should be between 2 and 32 characters'
        });
    }

    try {
      const updated = database.updateUser(db, id, token, name);
      if (updated) {
        return res.json({
          success: true,
          user: {
            id,
            token,
            name
          }
        });
      } else {
        return res.status(400).json({
          success: false,
          msg: 'Something went wrong'
        });
      }
    } catch (e) {
      return res.json({
        success: false,
        msg: 'Username is already taken'
      })
    }
  }));
}

export default Object.freeze({
  init
});
