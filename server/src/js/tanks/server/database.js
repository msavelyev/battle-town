import sqlite3 from 'sqlite3';
import fs from 'fs';
import util from 'util';
import * as rand from 'Lib/tanks/lib/util/rand.js';
import username from 'Server/tanks/server/username.js';

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

async function init(db) {
  await dbRun(db, `
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

    await dbRun(db, `
      INSERT INTO users (id, name, token, points)
      VALUES ($user, $user, $user, $points)
    `, {
      $user: name,
      $points: rand(5, 29)
    })
  }
}

export default {
  open: async function open(filename) {
    const alreadyCreated = await fileExists(filename);

    const db = new sqlite3.Database(filename);

    if (!alreadyCreated) {
      await init(db);
    }

    return db;
  },

  createUser: async function createUser(db, uuid, name, token) {
    await dbRun(db, `
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

  findUser: async function findUser(db, uuid, token) {
    return await dbGet(
      db,
      'SELECT * FROM users WHERE id = $id AND token = $token',
      {
        $id: uuid,
        $token: token
      }
    );
  },

  leaderboard: async function leaderboard(db, id) {
    const top = await dbAll(
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
      const you = await dbGet(
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

  updateUser: async function updateUser(db, id, token, name) {
    const updated = await dbRun(db, `
      UPDATE users SET name = $name
      WHERE id = $id AND token = $token
    `, {
      $id: id,
      $token: token,
      $name: name
    });

    return updated === 1;
  },

  addPoints: async function (db, id, points) {
    await dbRun(db, `
      UPDATE users SET points = points + $delta
      WHERE id = $id
    `, {
      $id: id,
      $delta: points
    });
  },

};
