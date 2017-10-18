const path = require('path');
const Promise = require('bluebird');
const csv = Promise.promisifyAll(require('csv'));
const fs = Promise.promisifyAll(require('fs'));

const { sequelize } = require('../models');

const writeCsv = (fileName, data) => {
  return csv.stringifyAsync(data, { header: true })
    .then(txt => fs.writeFileAsync(fileName, txt));
}

Promise.all([
  sequelize.query(`
    SELECT u.*, lgt."lastGive", lrt."lastReceive"
    FROM users u
    JOIN (
      SELECT "userFromId", MAX("createdAt") "lastGive"
      FROM transactions
      GROUP BY "userFromId"
    ) AS lgt
      ON lgt."userFromId" = u.id
    JOIN (
      SELECT "userToId", MAX("createdAt") "lastReceive"
      FROM transactions
      GROUP BY "userToId"
    ) AS lrt
      ON lrt."userToId" = u.id
    ORDER BY u.id;
  `, { type: sequelize.QueryTypes.SELECT})
  .then(users => {
    return writeCsv(path.join(
      __dirname,
      'export1.csv'
    ), users);
  }),

  sequelize.query(`
    SELECT u.*, lgt."totalGiven", lrt."totalReceived"
    FROM users u
    JOIN (
      SELECT "userFromId", SUM(amount) "totalGiven"
      FROM transactions
      GROUP BY "userFromId"
    ) AS lgt
      ON lgt."userFromId" = u.id
    JOIN (
      SELECT "userToId", SUM(amount) "totalReceived"
      FROM transactions
      GROUP BY "userToId"
    ) AS lrt
      ON lrt."userToId" = u.id
    ORDER BY u.id;
  `, { type: sequelize.QueryTypes.SELECT})
  .then(users => {
    return writeCsv(path.join(
      __dirname,
      'export2.csv'
    ), users);
  }),

  // sequelize.query(`
  //   SELECT u.*
  //   FROM users u
  //   JOIN (
  //     SELECT DISTINCT("userToId")
  //     FROM transactions t
  //     WHERE t."createdAt" >= DATE_TRUNC('DAY', (NOW() - INTERVAL '2' DAY))
  //   ) AS tl2d
  //     ON tl2d."userToId" = u.id
  //   ORDER BY u.id;
  // `, { type: sequelize.QueryTypes.SELECT})
  // .then(users => {
  //   return writeCsv(path.join(
  //     __dirname,
  //     'export3.csv'
  //   ), users);
  // }),
  sequelize.query(`
    SELECT u.*
    FROM users u
    JOIN (
      SELECT "userToId", MAX("createdAt") "lastReceive"
      FROM transactions
      GROUP BY "userToId"
    ) AS lrt
      ON lrt."userToId" = u.id
    WHERE lrt."lastReceive" >= DATE_TRUNC('DAY', (NOW() - INTERVAL '2' DAY))
    ORDER BY u.id;
  `, { type: sequelize.QueryTypes.SELECT})
  .then(users => {
    return writeCsv(path.join(
      __dirname,
      'export3.csv'
    ), users);
  }),

  sequelize.query(`
    SELECT u.*, lgt."maxGiven"
    FROM users u
    JOIN (
      SELECT "userFromId", max(amount) "maxGiven"
      FROM transactions
      GROUP BY "userFromId"
    ) AS lgt
      ON lgt."userFromId" = u.id
    WHERE "maxGiven" > 5
    ORDER BY u.id;
  `, { type: sequelize.QueryTypes.SELECT})
  .then(users => {
    return writeCsv(path.join(
      __dirname,
      'export4.csv'
    ), users);
  }),
])
.finally(function() {
  sequelize.close();
});
