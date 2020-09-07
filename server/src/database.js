import sqlite3 from 'sqlite3';
import fs from 'fs';
import util from 'util';

const fileExists = util.promisify(fs.exists);

function fetchOne(db, query, params) {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        return reject(err);
      }

      return resolve(row);
    });
  });
}

function fetchAll(db, query, params) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, row) => {
      if (err) {
        return reject(err);
      }

      return resolve(row);
    });
  });
}

async function init(db) {
  await db.run(`
    CREATE TABLE users
    (
      id     TEXT   NOT NULL PRIMARY KEY,
      name   TEXT   NOT NULL UNIQUE,
      token  TEXT   NOT NULL,
      points NUMBER NOT NULL DEFAULT 0
    );
  `);

  await db.run(`
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
  await db.run(`
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
  return await fetchOne(
    db,
    'SELECT * FROM users WHERE id = $id AND token = $token',
    {
      $id: uuid,
      $token: token
    }
  );
}

async function leaderboard(db, id) {
  const top = await fetchAll(
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
    const you = await fetchOne(
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

export default Object.freeze({
  open,
  createUser,
  findUser,
  leaderboard
});
