/*!
 * sort-object <https://github.com/doowb/sort-object>
 *
 * Copyright (c) 2014-2015, Brian Woodward.
 * Licensed under the MIT License
 */

'use strict';

const sortAsc = require('sort-asc');
const sortDesc = require('sort-desc');
const sortObj = require('./');

const makeCollection = function(postFix) {
  postFix = postFix || '';
  const collection = {};
  collection['one' + postFix] = { data: { date: '2015-JUN-30' } };
  collection['two' + postFix] = { data: { date: '2015-JUN-30' } };
  collection['three' + postFix] = { data: { date: '2015-JUN-30' } };
  collection['four' + postFix] = { data: { date: '2015-JUN-21' } };
  collection['five' + postFix] = { data: { date: '2015-JUN-21' } };
  collection['six' + postFix] = { data: { date: '2015-JUN-21' } };
  collection['seven' + postFix] = { data: { date: '2015-JUN-29' } };
  collection['eight' + postFix] = { data: { date: '2015-JUN-29' } };
  collection['nine' + postFix] = { data: { date: '2015-JUN-29' } };
  collection['ten' + postFix] = { data: { date: '2015-JUN-29' } };
  return collection;
};

describe('sort object', function() {
  it('should create a new object with only the given keys.', function() {
    const o = {a: 1, c: 2, b: 3};
    const actual = sortObj(o, {keys: ['a', 'b']});

    expect(Object.keys(actual)[0]).toBe('a');
    expect(Object.keys(actual)[1]).toBe('b');
    expect(actual).not.toHaveProperty('c');
  });

  it('should sort the keys on an object with alphabetical keys', function() {
    const o = {a: 1, c: 2, b: 3};
    const actual = sortObj(o);

    expect(Object.keys(actual)[0]).toBe('a');
    expect(Object.keys(actual)[1]).toBe('b');
    expect(Object.keys(actual)[2]).toBe('c');
  });

  it('should sort the keys on an object with numerical keys', function() {
    const o = {1: 1, 3: 3, 2: 2};
    const actual = sortObj(o);

    expect(Object.keys(actual)[0]).toBe('1');
    expect(Object.keys(actual)[1]).toBe('2');
    expect(Object.keys(actual)[2]).toBe('3');
  });

  it('should sort the keys on an object in descending order.', function() {
    const o = {a: 1, c: 2, b: 3};
    const actual = sortObj(o, {sortOrder: 'desc'});

    expect(Object.keys(actual)[0]).toBe('c');
    expect(Object.keys(actual)[1]).toBe('b');
    expect(Object.keys(actual)[2]).toBe('a');
  });

  it('should sort the keys on an object in ascending order.', function() {
    const o = {a: 1, c: 2, b: 3};
    const actual = sortObj(o, {sortOrder: 'asc'});

    expect(Object.keys(actual)[0]).toBe('a');
    expect(Object.keys(actual)[1]).toBe('b');
    expect(Object.keys(actual)[2]).toBe('c');
  });

  it('should sort the keys using a custom function.', function() {
    const o = {a: 1, c: 2, e: 5, d: 4, b: 3};
    const actual = sortObj(o, {
      sort: function(a, b) {
        return a < b ? -1 : 1;
      },
    });
    expect(actual).toEqual({a: 1, b: 3, c: 2, d: 4, e: 5});

    expect(Object.keys(actual)[0]).toBe('a');
    expect(Object.keys(actual)[1]).toBe('b');
    expect(Object.keys(actual)[2]).toBe('c');
  });

  it('should sort keys to the order in the given array.', function() {
    const o = sortObj({a: 'a', b: 'b', c: 'c'}, ['c', 'a', 'b']);

    expect(Object.keys(o)[0]).toBe('c');
    expect(Object.keys(o)[1]).toBe('a');
    expect(Object.keys(o)[2]).toBe('b');
  });

  it('should use a function to sort keys in the given array.', function() {
    const o = sortObj({a: 'a', b: 'b', c: 'c'}, {
      keys: ['c', 'a'],
      sort: sortDesc,
    });

    expect(Object.keys(o)[0]).toBe('c');
    expect(Object.keys(o)[1]).toBe('a');
    expect(o).not.toHaveProperty('b');
  });

  it('should use a function to sort keys in the given array.', function() {
    const o = sortObj({a: 'a', b: 'b', c: 'c'}, {
      keys: ['b', 'a'],
      sort: sortAsc,
    });

    expect(Object.keys(o)[0]).toBe('a');
    expect(Object.keys(o)[1]).toBe('b');
    expect(o).not.toHaveProperty('c');
  });

  it('should use a `sortBy` function to return an array of keys to sort by.', function() {
    const old = {one: 'aa', two: 'bc', three: 'ab'};
    const o = sortObj(old, {
      sortBy: function(obj) {
        const arr = [];
        Object.keys(obj).filter(function(key) {
          if (/^a/.test(obj[key])) {
            arr.push(key);
          }
        });
        return arr.reverse();
      },
    });

    expect(Object.keys(o).length).toBe(2);
    expect(Object.keys(o)[0]).toBe('three');
    expect(Object.keys(o)[1]).toBe('one');
  });

  it('should sort the keys of a complex obj', function() {
    const collection = makeCollection();
    const actual = sortObj(collection);
    expect(Object.keys(actual)[0]).toBe('eight');
    expect(Object.keys(actual)[1]).toBe('five');
    expect(Object.keys(actual)[2]).toBe('four');
    expect(Object.keys(actual)[3]).toBe('nine');
    expect(Object.keys(actual)[4]).toBe('one');
    expect(Object.keys(actual)[5]).toBe('seven');
    expect(Object.keys(actual)[6]).toBe('six');
    expect(Object.keys(actual)[7]).toBe('ten');
    expect(Object.keys(actual)[8]).toBe('three');
    expect(Object.keys(actual)[9]).toBe('two');
  });

  it('should sort the keys of a complex obj with keys containing `.`', function() {
    const collection = makeCollection('.md');
    const actual = sortObj(collection);
    expect(Object.keys(actual)[0]).toBe('eight.md');
    expect(Object.keys(actual)[1]).toBe('five.md');
    expect(Object.keys(actual)[2]).toBe('four.md');
    expect(Object.keys(actual)[3]).toBe('nine.md');
    expect(Object.keys(actual)[4]).toBe('one.md');
    expect(Object.keys(actual)[5]).toBe('seven.md');
    expect(Object.keys(actual)[6]).toBe('six.md');
    expect(Object.keys(actual)[7]).toBe('ten.md');
    expect(Object.keys(actual)[8]).toBe('three.md');
    expect(Object.keys(actual)[9]).toBe('two.md');
  });

  it('should use a `prop` string to sort on value properties.', function() {
    const collection = makeCollection();
    const actual = sortObj(collection, { prop: 'data.date' });
    expect(Object.keys(actual)[0]).toBe('four');
    expect(Object.keys(actual)[1]).toBe('five');
    expect(Object.keys(actual)[2]).toBe('six');
    expect(Object.keys(actual)[3]).toBe('seven');
    expect(Object.keys(actual)[4]).toBe('eight');
    expect(Object.keys(actual)[5]).toBe('nine');
    expect(Object.keys(actual)[6]).toBe('ten');
    expect(Object.keys(actual)[7]).toBe('one');
    expect(Object.keys(actual)[8]).toBe('two');
    expect(Object.keys(actual)[9]).toBe('three');
  });

  it('should use a `prop` string to sort on value properties with keys containing `.`', function() {
    const collection = makeCollection('.md');
    const actual = sortObj(collection, { prop: 'data.date' });
    expect(Object.keys(actual)[0]).toBe('four.md');
    expect(Object.keys(actual)[1]).toBe('five.md');
    expect(Object.keys(actual)[2]).toBe('six.md');
    expect(Object.keys(actual)[3]).toBe('seven.md');
    expect(Object.keys(actual)[4]).toBe('eight.md');
    expect(Object.keys(actual)[5]).toBe('nine.md');
    expect(Object.keys(actual)[6]).toBe('ten.md');
    expect(Object.keys(actual)[7]).toBe('one.md');
    expect(Object.keys(actual)[8]).toBe('two.md');
    expect(Object.keys(actual)[9]).toBe('three.md');
  });

  it('should use a `prop` string to sort on value properties in descending order.', function() {
    const collection = makeCollection();
    const actual = sortObj(collection, { prop: 'data.date', sortOrder: 'desc' });
    expect(Object.keys(actual)[0]).toBe('one');
    expect(Object.keys(actual)[1]).toBe('two');
    expect(Object.keys(actual)[2]).toBe('three');
    expect(Object.keys(actual)[3]).toBe('seven');
    expect(Object.keys(actual)[4]).toBe('eight');
    expect(Object.keys(actual)[5]).toBe('nine');
    expect(Object.keys(actual)[6]).toBe('ten');
    expect(Object.keys(actual)[7]).toBe('four');
    expect(Object.keys(actual)[8]).toBe('five');
    expect(Object.keys(actual)[9]).toBe('six');
  });

  it('should use a `prop` string to sort on value properties in ascending order.', function() {
    const collection = makeCollection();
    const actual = sortObj(collection, { prop: 'data.date', sortOrder: 'asc' });
    expect(Object.keys(actual)[0]).toBe('four');
    expect(Object.keys(actual)[1]).toBe('five');
    expect(Object.keys(actual)[2]).toBe('six');
    expect(Object.keys(actual)[3]).toBe('seven');
    expect(Object.keys(actual)[4]).toBe('eight');
    expect(Object.keys(actual)[5]).toBe('nine');
    expect(Object.keys(actual)[6]).toBe('ten');
    expect(Object.keys(actual)[7]).toBe('one');
    expect(Object.keys(actual)[8]).toBe('two');
    expect(Object.keys(actual)[9]).toBe('three');
  });

  it('should use a `prop` string to sort on object values by index.', function() {
    const collection = makeCollection();
    Object.keys(collection).forEach(function(key, i) {
      collection[key].data.complex = {
        index: i,
        key: key,
      };
    });
    const actual = sortObj(collection, { prop: 'data.complex' });
    expect(Object.keys(actual)[0]).toBe('one');
    expect(Object.keys(actual)[1]).toBe('two');
    expect(Object.keys(actual)[2]).toBe('three');
    expect(Object.keys(actual)[3]).toBe('four');
    expect(Object.keys(actual)[4]).toBe('five');
    expect(Object.keys(actual)[5]).toBe('six');
    expect(Object.keys(actual)[6]).toBe('seven');
    expect(Object.keys(actual)[7]).toBe('eight');
    expect(Object.keys(actual)[8]).toBe('nine');
    expect(Object.keys(actual)[9]).toBe('ten');
  });

  it('should use a `prop` string to sort on object values by index in descending order.', function() {
    const collection = makeCollection();
    Object.keys(collection).forEach(function(key, i) {
      collection[key].data.complex = {
        index: i,
        key: key,
      };
    });
    const actual = sortObj(collection, { prop: 'data.complex', sortOrder: 'desc' });
    expect(Object.keys(actual)[0]).toBe('ten');
    expect(Object.keys(actual)[1]).toBe('nine');
    expect(Object.keys(actual)[2]).toBe('eight');
    expect(Object.keys(actual)[3]).toBe('seven');
    expect(Object.keys(actual)[4]).toBe('six');
    expect(Object.keys(actual)[5]).toBe('five');
    expect(Object.keys(actual)[6]).toBe('four');
    expect(Object.keys(actual)[7]).toBe('three');
    expect(Object.keys(actual)[8]).toBe('two');
    expect(Object.keys(actual)[9]).toBe('one');
  });

  it('should use a `prop` string to sort on object values by key.', function() {
    const collection = makeCollection();
    Object.keys(collection).forEach(function(key, i) {
      collection[key].data.complex = {
        key: key,
        index: i,
      };
    });
    const actual = sortObj(collection, { prop: 'data.complex' });
    expect(Object.keys(actual)[0]).toBe('eight');
    expect(Object.keys(actual)[1]).toBe('five');
    expect(Object.keys(actual)[2]).toBe('four');
    expect(Object.keys(actual)[3]).toBe('nine');
    expect(Object.keys(actual)[4]).toBe('one');
    expect(Object.keys(actual)[5]).toBe('seven');
    expect(Object.keys(actual)[6]).toBe('six');
    expect(Object.keys(actual)[7]).toBe('ten');
    expect(Object.keys(actual)[8]).toBe('three');
    expect(Object.keys(actual)[9]).toBe('two');
  });

  it('should use a `prop` string to sort on object values by key in descending order.', function() {
    const collection = makeCollection();
    Object.keys(collection).forEach(function(key, i) {
      collection[key].data.complex = {
        key: key,
        index: i,
      };
    });
    const actual = sortObj(collection, { prop: 'data.complex', sortOrder: 'desc'});
    expect(Object.keys(actual)[0]).toBe('two');
    expect(Object.keys(actual)[1]).toBe('three');
    expect(Object.keys(actual)[2]).toBe('ten');
    expect(Object.keys(actual)[3]).toBe('six');
    expect(Object.keys(actual)[4]).toBe('seven');
    expect(Object.keys(actual)[5]).toBe('one');
    expect(Object.keys(actual)[6]).toBe('nine');
    expect(Object.keys(actual)[7]).toBe('four');
    expect(Object.keys(actual)[8]).toBe('five');
    expect(Object.keys(actual)[9]).toBe('eight');
  });
});
