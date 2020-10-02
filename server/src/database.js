import sqlite3 from 'sqlite3';
import fs from 'fs';
import util from 'util';
import * as rand from '../../lib/src/util/rand.js';
import username from './username.js';

const fileExists = util.promisify(fs.exists);

function dbGet(db, query, params) {
  return util.promisify(db.get.bind(db))(query, params);
}

function dbAll(db, query, params) {
  return util.promisify(db.all.bind(db))(query, params);
}

function dbRun(db, query, params) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        return reject(err);
      }

      resolve(this.changes);
    });
  });

}

function init(db) {
  dbRun(db, `
    CREATE TABLE users
    (
      id     TEXT   NOT NULL PRIMARY KEY,
      name   TEXT   NOT NULL UNIQUE,
      token  TEXT   NOT NULL,
      points NUMBER NOT NULL DEFAULT 0
    );
  `);

  for (let i = 0; i < 5; i++) {
    const name = username.generate();

    dbRun(db, `
      INSERT INTO users (id, name, token, points)
      VALUES ($user, $user, $user, $points)
    `, {
      $user: name,
      $points: rand(5, 29)
    })
  }
}

export default {
  open: function open(filename) {
    const alreadyCreated = fileExists(filename);

    const db = new sqlite3.Database(filename);

    if (!alreadyCreated) {
      init(db);
    }

    return db;
  },

  createUser: function createUser(db, uuid, name, token) {
    dbRun(db, `
      INSERT INTO users (id, name, token)
      VALUES ($id, $name, $token)
    `, {
      $id: uuid,
      $name: name,
      $token: token
    });

    return {
      id: uuid,
      name: name,
      token: token
    };
  },

  findUser: function findUser(db, uuid, token) {
    return dbGet(
      db,
      'SELECT * FROM users WHERE id = $id AND token = $token',
      {
        $id: uuid,
        $token: token
      }
    );
  },

  leaderboard: function leaderboard(db, id) {
    const top = dbAll(
      db,
      `
        SELECT
          id,
          ROW_NUMBER() OVER (ORDER BY points DESC) AS rank,
          name,
          points
        FROM users
        ORDER BY points DESC
        LIMIT 5
      `
    );

    if (!top.find(item => item.id === id)) {
      const you = dbGet(
        db,
        `
        SELECT * FROM (
          SELECT
            id,
            ROW_NUMBER() OVER (ORDER BY points DESC) AS rank,
            name,
            points
          FROM users
        ) WHERE id = $id
      `,
        { $id: id }
      );

      top.push(you);
    }

    return top;
  },

  updateUser: function updateUser(db, id, token, name) {
    const updated = dbRun(db, `
      UPDATE users SET name = $name
      WHERE id = $id AND token = $token
    `, {
      $id: id,
      $token: token,
      $name: name
    });

    return updated === 1;
  },

  addPoints: function (db, id, points) {
    dbRun(db, `
      UPDATE users SET points = points + $delta
      WHERE id = $id
    `, {
      $id: id,
      $delta: points
    });
  },

};
