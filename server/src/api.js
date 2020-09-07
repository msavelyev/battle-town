import {v4 as uuid} from 'uuid';
import database from './database.js';
import username from './username.js';

import express from 'express';

function handleErrors(fn) {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (err) {
      console.log(err);
      await res.status(500).json(err);
    }
  };
}

export async function init(filename, expressApp) {
  expressApp.use(express.json());

  const db = await database.open(filename);

  expressApp.use(async (err, req, res, next) => {
    console.log('huh?');
    if (err) {
      console.log(err);
      await res.status(500).json(err);
      return;
    }

    next();
  });

  expressApp.get('/api/new', handleErrors(async (req, res) => {
    const user = await database.createUser(db, uuid(), username.generate(), uuid());
    console.log('created', user);
    await res.json(user);
  }));

  expressApp.post('/api/get', handleErrors(async (req, res) => {
    const body = req.body;
    const user = await database.findUser(db, body.id, body.token);

    if (!user) {
      await res.status(404).end();
    } else {
      await res.json(user);
    }
  }));

  expressApp.get('/api/top', handleErrors(async (req, res) => {
    const id = req.query.id;
    const top = await database.leaderboard(db, id);

    await res.json(top);
  }));

  expressApp.post('/api/update', handleErrors(async (req, res) => {
    const user = req.body;
    const name = user.name.trim();
    const id = user.id;
    const token = user.token;

    if (!username.validate(user.name)) {
      return await res.status(400)
        .json({
          success: false,
          msg: 'Username length should be between 2 and 32 characters'
        });
    }

    try {
      const updated = await database.updateUser(db, id, token, name);
      if (updated) {
        return await res.json({
          success: true,
          user: {
            id,
            token,
            name
          }
        });
      } else {
        return await res.status(400).json({
          success: false,
          msg: 'Something went wrong'
        });
      }
    } catch (e) {
      return await res.json({
        success: false,
        msg: 'Username is already taken'
      })
    }
  }));
}

export default Object.freeze({
  init
});
