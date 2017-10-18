const Promise = require('bluebird');
const csv = Promise.promisifyAll(require('csv'));
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const _ = require('lodash');

function getCsv(filePath) {
  return fs.readFileAsync(filePath)
  .then(function(data) {
    return csv.parseAsync(data);
  })
  .then(function(data) {
    const headers = _.first(data);
    const values = _.tail(data);

    const mappedValues = _.map(values, function(value) {
      return _.zipObject(headers, value);
    });

    return mappedValues;
  });
}

test('Query 1', () => {
  return Promise.all([
    getCsv(path.join(
      __dirname,
      '..',
      'test',
      'export1.csv'
    )),
    getCsv(path.join(
      __dirname,
      'export1.csv'
    ))
  ])
  .spread(function(expectedValues, generatedValues) {
    const expectedValuesById = _.keyBy(expectedValues, 'id');
    const queriedValuesById = _.keyBy(generatedValues, 'id');

    _.each(queriedValuesById, function(value, id) {
      expect(value.lastGive).toEqual(expectedValuesById[id].lastGive);
      expect(value.lastReceive).toEqual(expectedValuesById[id].lastReceive);
    });

    _.each(expectedValuesById, function(value, id) {
      expect(value.lastGive).toEqual(expectedValuesById[id].lastGive);
      expect(value.lastReceive).toEqual(expectedValuesById[id].lastReceive);
    });
  });
});

test('Query 2', () => {
  return Promise.all([
    getCsv(path.join(
      __dirname,
      '..',
      'test',
      'export2.csv'
    )),
    getCsv(path.join(
      __dirname,
      'export2.csv'
    ))
  ])
  .spread(function(expectedValues, generatedValues) {
    const expectedValuesById = _.keyBy(expectedValues, 'id');
    const queriedValuesById = _.keyBy(generatedValues, 'id');

    _.each(queriedValuesById, function(value, id) {
      expect(value.totalGiven).toEqual(expectedValuesById[id].totalGiven);
      expect(value.totalReceived).toEqual(expectedValuesById[id].totalReceived);
    });

    _.each(expectedValuesById, function(value, id) {
      expect(value.totalGiven).toEqual(queriedValuesById[id].totalGiven);
      expect(value.totalReceived).toEqual(queriedValuesById[id].totalReceived);
    });
  });
});

test('Query 3', () => {
  return Promise.all([
    getCsv(path.join(
      __dirname,
      '..',
      'test',
      'export3.csv'
    )),
    getCsv(path.join(
      __dirname,
      'export3.csv'
    ))
  ])
  .spread(function(expectedValues, generatedValues) {
    const expectedValuesById = _.keyBy(expectedValues, 'id');
    const queriedValuesById = _.keyBy(generatedValues, 'id');

    _.each(queriedValuesById, function(value, id) {
      expect(expectedValuesById).toHaveProperty(id);
    });

    _.each(expectedValuesById, function(value, id) {
      expect(queriedValuesById).toHaveProperty(id);
    });
  });
});

test('Query 4', () => {
  return Promise.all([
    getCsv(path.join(
      __dirname,
      '..',
      'test',
      'export4.csv'
    )),
    getCsv(path.join(
      __dirname,
      'export4.csv'
    ))
  ])
  .spread(function(expectedValues, generatedValues) {
    const expectedValuesById = _.keyBy(expectedValues, 'id');
    const queriedValuesById = _.keyBy(generatedValues, 'id');

    _.each(queriedValuesById, function(value, id) {
      expect(expectedValuesById).toHaveProperty(id);
    });

    _.each(expectedValuesById, function(value, id) {
      expect(queriedValuesById).toHaveProperty(id);
    });
  });
});
