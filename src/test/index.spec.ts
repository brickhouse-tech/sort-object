/*!
 * sort-object <https://github.com/doowb/sort-object>
 *
 * Copyright (c) 2014-2015, Brian Woodward.
 * Licensed under the MIT License
 */

import { describe, it, expect } from "vitest";
import sortAsc from "sort-asc";
import sortDesc from "sort-desc";
import sortObj from "../index.js";

const makeCollection = function (postFix?: string) {
  postFix = postFix || "";
  const collection: Record<string, { data: { date: string; complex?: { index: number; key: string } } }> = {};
  collection["one" + postFix] = { data: { date: "2015-JUN-30" } };
  collection["two" + postFix] = { data: { date: "2015-JUN-30" } };
  collection["three" + postFix] = { data: { date: "2015-JUN-30" } };
  collection["four" + postFix] = { data: { date: "2015-JUN-21" } };
  collection["five" + postFix] = { data: { date: "2015-JUN-21" } };
  collection["six" + postFix] = { data: { date: "2015-JUN-21" } };
  collection["seven" + postFix] = { data: { date: "2015-JUN-29" } };
  collection["eight" + postFix] = { data: { date: "2015-JUN-29" } };
  collection["nine" + postFix] = { data: { date: "2015-JUN-29" } };
  collection["ten" + postFix] = { data: { date: "2015-JUN-29" } };
  return collection;
};

describe("sort object", function () {
  it("should create a new object with only the given keys.", function () {
    const o = { a: 1, c: 2, b: 3 };
    const actual = sortObj(o, { keys: ["a", "b"] });

    expect(Object.keys(actual)[0]).toBe("a");
    expect(Object.keys(actual)[1]).toBe("b");
    expect(actual).not.toHaveProperty("c");
  });

  it("should sort the keys on an object with alphabetical keys", function () {
    const o = { a: 1, c: 2, b: 3 };
    const actual = sortObj(o);

    expect(Object.keys(actual)[0]).toBe("a");
    expect(Object.keys(actual)[1]).toBe("b");
    expect(Object.keys(actual)[2]).toBe("c");
  });

  it("should sort the keys on an object with numerical keys", function () {
    const o = { 1: 1, 3: 3, 2: 2 };
    const actual = sortObj(o);

    expect(Object.keys(actual)[0]).toBe("1");
    expect(Object.keys(actual)[1]).toBe("2");
    expect(Object.keys(actual)[2]).toBe("3");
  });

  it("should sort the keys on an object in descending order.", function () {
    const o = { a: 1, c: 2, b: 3 };
    const actual = sortObj(o, { sortOrder: "desc" });

    expect(Object.keys(actual)[0]).toBe("c");
    expect(Object.keys(actual)[1]).toBe("b");
    expect(Object.keys(actual)[2]).toBe("a");
  });

  it("should sort the keys on an object in ascending order.", function () {
    const o = { a: 1, c: 2, b: 3 };
    const actual = sortObj(o, { sortOrder: "asc" });

    expect(Object.keys(actual)[0]).toBe("a");
    expect(Object.keys(actual)[1]).toBe("b");
    expect(Object.keys(actual)[2]).toBe("c");
  });

  it("should sort the keys using a custom function.", function () {
    const o = { a: 1, c: 2, e: 5, d: 4, b: 3 };
    const actual = sortObj(o, {
      sort: function (a: string, b: string) {
        return a < b ? -1 : 1;
      },
    });
    expect(actual).toEqual({ a: 1, b: 3, c: 2, d: 4, e: 5 });

    expect(Object.keys(actual)[0]).toBe("a");
    expect(Object.keys(actual)[1]).toBe("b");
    expect(Object.keys(actual)[2]).toBe("c");
  });

  it("should sort keys to the order in the given array.", function () {
    const o = sortObj({ a: "a", b: "b", c: "c" }, ["c", "a", "b"]);

    expect(Object.keys(o)[0]).toBe("c");
    expect(Object.keys(o)[1]).toBe("a");
    expect(Object.keys(o)[2]).toBe("b");
  });

  it("should use a function to sort keys in the given array.", function () {
    const o = sortObj(
      { a: "a", b: "b", c: "c" },
      {
        keys: ["c", "a"],
        sort: sortDesc,
      },
    );

    expect(Object.keys(o)[0]).toBe("c");
    expect(Object.keys(o)[1]).toBe("a");
    expect(o).not.toHaveProperty("b");
  });

  it("should use a function to sort keys in the given array (asc).", function () {
    const o = sortObj(
      { a: "a", b: "b", c: "c" },
      {
        keys: ["b", "a"],
        sort: sortAsc,
      },
    );

    expect(Object.keys(o)[0]).toBe("a");
    expect(Object.keys(o)[1]).toBe("b");
    expect(o).not.toHaveProperty("c");
  });

  it("should use a `sortBy` function to return an array of keys to sort by.", function () {
    const old = { one: "aa", two: "bc", three: "ab" };
    const o = sortObj(old, {
      sortBy: function (obj) {
        const arr: string[] = [];
        Object.keys(obj).filter(function (key) {
          if (/^a/.test(obj[key] as string)) {
            arr.push(key);
          }
        });
        return arr.reverse();
      },
    });

    expect(Object.keys(o).length).toBe(2);
    expect(Object.keys(o)[0]).toBe("three");
    expect(Object.keys(o)[1]).toBe("one");
  });

  it("should sort the keys of a complex obj", function () {
    const collection = makeCollection();
    const actual = sortObj(collection);
    expect(Object.keys(actual)[0]).toBe("eight");
    expect(Object.keys(actual)[1]).toBe("five");
    expect(Object.keys(actual)[2]).toBe("four");
    expect(Object.keys(actual)[3]).toBe("nine");
    expect(Object.keys(actual)[4]).toBe("one");
    expect(Object.keys(actual)[5]).toBe("seven");
    expect(Object.keys(actual)[6]).toBe("six");
    expect(Object.keys(actual)[7]).toBe("ten");
    expect(Object.keys(actual)[8]).toBe("three");
    expect(Object.keys(actual)[9]).toBe("two");
  });

  it('should sort the keys of a complex obj with keys containing `.`', function () {
    const collection = makeCollection(".md");
    const actual = sortObj(collection);
    expect(Object.keys(actual)[0]).toBe("eight.md");
    expect(Object.keys(actual)[1]).toBe("five.md");
    expect(Object.keys(actual)[2]).toBe("four.md");
    expect(Object.keys(actual)[3]).toBe("nine.md");
    expect(Object.keys(actual)[4]).toBe("one.md");
    expect(Object.keys(actual)[5]).toBe("seven.md");
    expect(Object.keys(actual)[6]).toBe("six.md");
    expect(Object.keys(actual)[7]).toBe("ten.md");
    expect(Object.keys(actual)[8]).toBe("three.md");
    expect(Object.keys(actual)[9]).toBe("two.md");
  });

  it("should use a `prop` string to sort on value properties.", function () {
    const collection = makeCollection();
    const actual = sortObj(collection, { prop: "data.date" });
    expect(Object.keys(actual)[0]).toBe("four");
    expect(Object.keys(actual)[1]).toBe("five");
    expect(Object.keys(actual)[2]).toBe("six");
    expect(Object.keys(actual)[3]).toBe("seven");
    expect(Object.keys(actual)[4]).toBe("eight");
    expect(Object.keys(actual)[5]).toBe("nine");
    expect(Object.keys(actual)[6]).toBe("ten");
    expect(Object.keys(actual)[7]).toBe("one");
    expect(Object.keys(actual)[8]).toBe("two");
    expect(Object.keys(actual)[9]).toBe("three");
  });

  it('should use a `prop` string to sort on value properties with keys containing `.`', function () {
    const collection = makeCollection(".md");
    const actual = sortObj(collection, { prop: "data.date" });
    expect(Object.keys(actual)[0]).toBe("four.md");
    expect(Object.keys(actual)[1]).toBe("five.md");
    expect(Object.keys(actual)[2]).toBe("six.md");
    expect(Object.keys(actual)[3]).toBe("seven.md");
    expect(Object.keys(actual)[4]).toBe("eight.md");
    expect(Object.keys(actual)[5]).toBe("nine.md");
    expect(Object.keys(actual)[6]).toBe("ten.md");
    expect(Object.keys(actual)[7]).toBe("one.md");
    expect(Object.keys(actual)[8]).toBe("two.md");
    expect(Object.keys(actual)[9]).toBe("three.md");
  });

  it("should use a `prop` string to sort on value properties in descending order.", function () {
    const collection = makeCollection();
    const actual = sortObj(collection, { prop: "data.date", sortOrder: "desc" });
    expect(Object.keys(actual)[0]).toBe("one");
    expect(Object.keys(actual)[1]).toBe("two");
    expect(Object.keys(actual)[2]).toBe("three");
    expect(Object.keys(actual)[3]).toBe("seven");
    expect(Object.keys(actual)[4]).toBe("eight");
    expect(Object.keys(actual)[5]).toBe("nine");
    expect(Object.keys(actual)[6]).toBe("ten");
    expect(Object.keys(actual)[7]).toBe("four");
    expect(Object.keys(actual)[8]).toBe("five");
    expect(Object.keys(actual)[9]).toBe("six");
  });

  it("should use a `prop` string to sort on value properties in ascending order.", function () {
    const collection = makeCollection();
    const actual = sortObj(collection, { prop: "data.date", sortOrder: "asc" });
    expect(Object.keys(actual)[0]).toBe("four");
    expect(Object.keys(actual)[1]).toBe("five");
    expect(Object.keys(actual)[2]).toBe("six");
    expect(Object.keys(actual)[3]).toBe("seven");
    expect(Object.keys(actual)[4]).toBe("eight");
    expect(Object.keys(actual)[5]).toBe("nine");
    expect(Object.keys(actual)[6]).toBe("ten");
    expect(Object.keys(actual)[7]).toBe("one");
    expect(Object.keys(actual)[8]).toBe("two");
    expect(Object.keys(actual)[9]).toBe("three");
  });

  it("should use a `prop` string to sort on object values by index.", function () {
    const collection = makeCollection();
    Object.keys(collection).forEach(function (key, i) {
      collection[key].data.complex = {
        index: i,
        key: key,
      };
    });
    const actual = sortObj(collection, { prop: "data.complex" });
    expect(Object.keys(actual)[0]).toBe("one");
    expect(Object.keys(actual)[1]).toBe("two");
    expect(Object.keys(actual)[2]).toBe("three");
    expect(Object.keys(actual)[3]).toBe("four");
    expect(Object.keys(actual)[4]).toBe("five");
    expect(Object.keys(actual)[5]).toBe("six");
    expect(Object.keys(actual)[6]).toBe("seven");
    expect(Object.keys(actual)[7]).toBe("eight");
    expect(Object.keys(actual)[8]).toBe("nine");
    expect(Object.keys(actual)[9]).toBe("ten");
  });

  it("should use a `prop` string to sort on object values by index in descending order.", function () {
    const collection = makeCollection();
    Object.keys(collection).forEach(function (key, i) {
      collection[key].data.complex = {
        index: i,
        key: key,
      };
    });
    const actual = sortObj(collection, { prop: "data.complex", sortOrder: "desc" });
    expect(Object.keys(actual)[0]).toBe("ten");
    expect(Object.keys(actual)[1]).toBe("nine");
    expect(Object.keys(actual)[2]).toBe("eight");
    expect(Object.keys(actual)[3]).toBe("seven");
    expect(Object.keys(actual)[4]).toBe("six");
    expect(Object.keys(actual)[5]).toBe("five");
    expect(Object.keys(actual)[6]).toBe("four");
    expect(Object.keys(actual)[7]).toBe("three");
    expect(Object.keys(actual)[8]).toBe("two");
    expect(Object.keys(actual)[9]).toBe("one");
  });

  it("should use a `prop` string to sort on object values by key.", function () {
    const collection = makeCollection();
    Object.keys(collection).forEach(function (key, i) {
      collection[key].data.complex = {
        key: key,
        index: i,
      };
    });
    const actual = sortObj(collection, { prop: "data.complex" });
    expect(Object.keys(actual)[0]).toBe("eight");
    expect(Object.keys(actual)[1]).toBe("five");
    expect(Object.keys(actual)[2]).toBe("four");
    expect(Object.keys(actual)[3]).toBe("nine");
    expect(Object.keys(actual)[4]).toBe("one");
    expect(Object.keys(actual)[5]).toBe("seven");
    expect(Object.keys(actual)[6]).toBe("six");
    expect(Object.keys(actual)[7]).toBe("ten");
    expect(Object.keys(actual)[8]).toBe("three");
    expect(Object.keys(actual)[9]).toBe("two");
  });

  it("should use a `prop` string to sort on object values by key in descending order.", function () {
    const collection = makeCollection();
    Object.keys(collection).forEach(function (key, i) {
      collection[key].data.complex = {
        key: key,
        index: i,
      };
    });
    const actual = sortObj(collection, { prop: "data.complex", sortOrder: "desc" });
    expect(Object.keys(actual)[0]).toBe("two");
    expect(Object.keys(actual)[1]).toBe("three");
    expect(Object.keys(actual)[2]).toBe("ten");
    expect(Object.keys(actual)[3]).toBe("six");
    expect(Object.keys(actual)[4]).toBe("seven");
    expect(Object.keys(actual)[5]).toBe("one");
    expect(Object.keys(actual)[6]).toBe("nine");
    expect(Object.keys(actual)[7]).toBe("four");
    expect(Object.keys(actual)[8]).toBe("five");
    expect(Object.keys(actual)[9]).toBe("eight");
  });
});

describe("edge cases", function () {
  it("should handle an empty object", function () {
    const actual = sortObj({});
    expect(Object.keys(actual)).toEqual([]);
  });

  it("should throw TypeError for null input", function () {
    expect(() => sortObj(null as unknown as Record<string, unknown>)).toThrow(TypeError);
  });

  it("should throw TypeError for undefined input", function () {
    expect(() => sortObj(undefined as unknown as Record<string, unknown>)).toThrow(TypeError);
  });

  it("should throw TypeError for array input", function () {
    expect(() => sortObj([] as unknown as Record<string, unknown>)).toThrow(TypeError);
  });

  it("should throw TypeError for primitive input", function () {
    expect(() => sortObj("string" as unknown as Record<string, unknown>)).toThrow(TypeError);
    expect(() => sortObj(42 as unknown as Record<string, unknown>)).toThrow(TypeError);
  });

  it("should handle objects with null/undefined values", function () {
    const o = { a: null, b: undefined, c: 1 };
    const actual = sortObj(o);
    expect(Object.keys(actual)).toEqual(["a", "b", "c"]);
    expect(actual.a).toBeNull();
    expect(actual.b).toBeUndefined();
  });

  it("should handle keys that don't exist in object (via keys option)", function () {
    const o = { a: 1, b: 2 };
    const actual = sortObj(o, { keys: ["a", "z", "b"] });
    // 'z' key should exist but be undefined
    expect(Object.keys(actual)).toEqual(["a", "z", "b"]);
    expect(actual.z).toBeUndefined();
  });

  it("should handle large objects", function () {
    const o: Record<string, number> = {};
    for (let i = 0; i < 1000; i++) {
      o[`key_${String(i).padStart(4, "0")}`] = i;
    }
    const actual = sortObj(o);
    const keys = Object.keys(actual);
    expect(keys.length).toBe(1000);
    expect(keys[0]).toBe("key_0000");
    expect(keys[999]).toBe("key_0999");
  });

  it("should not be affected by prototype pollution", function () {
    const proto = { polluted: "yes" };
    const o = Object.create(proto);
    o.a = 1;
    o.b = 2;
    const actual = sortObj(o);
    expect(actual).not.toHaveProperty("polluted");
    expect(Object.keys(actual)).toEqual(["a", "b"]);
  });

  it("should return a new object (immutability)", function () {
    const o = { b: 2, a: 1 };
    const actual = sortObj(o);
    expect(actual).not.toBe(o);
    expect(actual).toEqual({ a: 1, b: 2 });
  });
});

describe("deep sort", function () {
  it("should recursively sort nested objects when deep: true", function () {
    const o = {
      c: { z: 1, a: 2 },
      a: { y: 3, b: 4 },
    };
    const actual = sortObj(o, { deep: true });
    expect(Object.keys(actual)).toEqual(["a", "c"]);
    expect(Object.keys(actual.a as Record<string, unknown>)).toEqual(["b", "y"]);
    expect(Object.keys(actual.c as Record<string, unknown>)).toEqual(["a", "z"]);
  });

  it("should not sort nested objects without deep: true", function () {
    const o = {
      c: { z: 1, a: 2 },
      a: 1,
    };
    const actual = sortObj(o);
    expect(Object.keys(actual)).toEqual(["a", "c"]);
    // nested object keeps its original key order
    expect(Object.keys(actual.c as Record<string, unknown>)).toEqual(["z", "a"]);
  });

  it("should handle deeply nested objects", function () {
    const o = {
      b: {
        d: { f: 1, e: 2 },
        c: 3,
      },
      a: 4,
    };
    const actual = sortObj(o, { deep: true });
    expect(Object.keys(actual)).toEqual(["a", "b"]);
    const b = actual.b as Record<string, unknown>;
    expect(Object.keys(b)).toEqual(["c", "d"]);
    expect(Object.keys(b.d as Record<string, unknown>)).toEqual(["e", "f"]);
  });
});

describe("sortBy callback", function () {
  it("should accept a sortBy function that filters and orders keys", function () {
    const o = { apple: 1, banana: 2, cherry: 3, date: 4 };
    const actual = sortObj(o, {
      sortBy: (obj) => Object.keys(obj).filter((k) => k.length <= 5),
    });
    expect(Object.keys(actual)).toEqual(["apple", "date"]);
  });
});

describe("sortOrder: desc", function () {
  it("should sort mixed keys in descending order", function () {
    const o = { x: "a", z: "c", y: "b" };
    const actual = sortObj(o, { sortOrder: "desc" });
    expect(Object.keys(actual)).toEqual(["z", "y", "x"]);
  });
});
