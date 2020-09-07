import sqlite3 from 'sqlite3';
import fs from 'fs';
import util from 'util';

const fileExists = util.promisify(fs.exists);

const dbGet =

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

  await dbRun(db, `
    INSERT INTO users (id, name, token, points)
    VALUES
      ('user#1', 'user#1', 'user#1', 1000),
      ('user#2', 'user#2', 'user#2', 970),
      ('user#3', 'user#3', 'user#3', 960),
      ('user#4', 'user#4', 'user#4', 950),
      ('user#5', 'user#5', 'user#5', 940),
      ('user#6', 'user#6', 'user#6', 930),
      ('user#7', 'user#7', 'user#7', 920),
      ('user#8', 'user#8', 'user#8', 910);
  `);
}

async function open(filename) {
  const alreadyCreated = await fileExists(filename);

  const db = new sqlite3.Database(filename);

  if (!alreadyCreated) {
    await init(db);
  }

  return db;
}

async function createUser(db, uuid, name, token) {
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
}

async function findUser(db, uuid, token) {
  return await dbGet(
    db,
    'SELECT * FROM users WHERE id = $id AND token = $token',
    {
      $id: uuid,
      $token: token
    }
  );
}

async function leaderboard(db, id) {
  const top = await dbAll(
    db,
    `
      SELECT
        id,
        RANK() OVER (ORDER BY points DESC) AS rank,
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
          RANK() OVER (ORDER BY points DESC) AS rank,
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
}

async function updateUser(db, id, token, name) {
  const updated = await dbRun(db, `
    UPDATE users SET name = $name
    WHERE id = $id AND token = $token
  `, {
    $id: id,
    $token: token,
    $name: name
  });

  return updated === 1;
}

export default Object.freeze({
  open,
  createUser,
  findUser,
  leaderboard,
  updateUser
});
