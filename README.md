# @znemz/sort-object

[![npm version](https://img.shields.io/npm/v/@znemz/sort-object.svg)](https://www.npmjs.com/package/@znemz/sort-object)

> Sort the keys in an object. TypeScript-first, ESM, maintained fork of [sort-object](https://github.com/doowb/sort-object).

## Why this fork?

- ✅ **TypeScript** — Full type definitions included
- ✅ **ESM** — Native ES modules with `type: "module"`
- ✅ **Maintained** — Active maintenance, modern tooling (vitest, eslint 9)
- ✅ **New features** — Deep/recursive sort, input validation
- ✅ **Node 20+** — Modern engine target

## Install

```sh
npm i @znemz/sort-object
```

## Usage

### TypeScript / ESM

```ts
import sortObj from "@znemz/sort-object";
// or: import { sort } from "@znemz/sort-object";

const sorted = sortObj({ a: 1, c: 2, b: 3 });
// => { a: 1, b: 3, c: 2 }
```

### With options

```ts
import sortObj, { type SortOptions } from "@znemz/sort-object";

const options: SortOptions = {
  sortOrder: "desc",
};

sortObj({ a: 1, c: 2, b: 3 }, options);
// => { c: 2, b: 3, a: 1 }
```

## API

### `sort(obj, options?)`

Returns a **new object** with sorted keys (does not mutate the original).

#### Options

| Option | Type | Description |
|---|---|---|
| `keys` | `string[]` | Only include these keys, in this order |
| `sort` | `(a, b) => number` | Custom sort function for keys |
| `sortOrder` | `'asc' \| 'desc'` | Sort direction (case insensitive) |
| `sortBy` | `(obj) => string[]` | Function returning array of keys to sort by |
| `prop` | `string` | Property path to sort by (for nested values) |
| `get` | `(val, prop?) => unknown` | Custom getter for sort values |
| `deep` | `boolean` | Recursively sort nested objects |

The second parameter can also be an **array of keys** (shorthand for `{ keys: [...] }`):

```ts
sortObj({ a: 1, c: 2, b: 3 }, ["c", "a", "b"]);
// => { c: 2, a: 1, b: 3 }
```

### options.keys

Create a new object with only the given keys:

```ts
sortObj({ a: 1, c: 2, e: 5, d: 4, b: 3 }, { keys: ["a", "b"] });
// => { a: 1, b: 3 }
```

### options.sort

Custom sort function passed to JavaScript's `.sort()`:

```ts
sortObj({ a: 1, c: 2, e: 5, d: 4, b: 3 }, {
  sort: (a, b) => (a < b ? -1 : 1),
});
// => { a: 1, b: 3, c: 2, d: 4, e: 5 }
```

### options.sortOrder

Sort ascending or descending:

```ts
sortObj({ a: 1, c: 2, b: 3 }, { sortOrder: "desc" });
// => { c: 2, b: 3, a: 1 }
```

### options.sortBy

Function that returns an array of keys to sort by:

```ts
const old = { one: "aa", two: "bc", three: "ab" };
sortObj(old, {
  sortBy: (obj) =>
    Object.keys(obj)
      .filter((key) => /^a/.test(obj[key] as string))
      .reverse(),
});
// => { three: 'ab', one: 'aa' }
```

### options.deep

Recursively sort nested objects:

```ts
sortObj(
  { c: { z: 1, a: 2 }, a: { y: 3, b: 4 } },
  { deep: true },
);
// => { a: { b: 4, y: 3 }, c: { a: 2, z: 1 } }
```

## Notes

- **Immutable**: Always returns a new object; the input is never mutated.
- **Input validation**: Throws `TypeError` for non-object inputs (null, arrays, primitives).
- **Prototype-safe**: Only own properties are sorted; inherited properties are ignored.

## Original Author

**Brian Woodward** — [github/doowb](https://github.com/doowb)

## Maintainer

**Nick McCready** — [github/nmccready](https://github.com/nmccready)

## License

MIT © [Brian Woodward](https://github.com/doowb), [Nick McCready](https://github.com/nmccready)
