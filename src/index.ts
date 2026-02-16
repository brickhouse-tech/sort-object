/*!
 * sort-object <https://github.com/helpers/sort-object>
 *
 * Copyright (c) 2014-2015, Brian Woodward.
 * Licensed under the MIT License
 */

import isObject from "is-extendable";
import sortDesc from "sort-desc";
import bytewise from "bytewise";
import union from "@znemz/union-value";
import sortAsc from "sort-asc";
import get from "get-value";

const sortFns: Record<string, SortFunction> = { desc: sortDesc, asc: sortAsc };

/**
 * Sort function type - compares two values for ordering.
 */
export type SortFunction = (a: string, b: string) => number;

/**
 * Options for the sort function.
 */
export interface SortOptions<T extends Record<string, unknown> = Record<string, unknown>> {
  /** Array of keys to include in the result (in order). */
  keys?: string[];
  /** Custom sort function for keys. */
  sort?: SortFunction;
  /** Sort order: 'asc' or 'desc' (case insensitive). */
  sortOrder?: "asc" | "desc" | "ASC" | "DESC" | string;
  /** Function that returns an array of keys to sort by. */
  sortBy?: (obj: T) => string[];
  /** Property path to sort by (for objects with nested values). */
  prop?: string;
  /** Custom getter function for extracting sort values. */
  get?: (val: unknown, prop?: string) => unknown;
  /** If true, recursively sort nested objects. */
  deep?: boolean;
}

/**
 * Sort the keys in an object.
 *
 * @param obj - The object to sort.
 * @param options - Sort options, or an array of keys.
 * @returns A new object with sorted keys.
 */
export function sort<T extends Record<string, unknown>>(
  obj: T,
  options?: SortOptions<T> | string[],
): Partial<T> {
  if (obj == null || typeof obj !== "object" || Array.isArray(obj)) {
    throw new TypeError(
      `sort-object expects a plain object, got ${obj === null ? "null" : typeof obj}`,
    );
  }

  if (Array.isArray(options)) {
    options = { keys: options } as SortOptions<T>;
  }

  const opts: SortOptions<T> = options || {};
  const prop = opts.prop;
  const getFn =
    opts.get ||
    function (val: unknown) {
      if (prop) return get(val, prop);
    };
  let fn: SortFunction | null = opts.sort || sortAsc;

  if (opts.sortOrder) {
    fn = sortFns[opts.sortOrder.toLowerCase()] || null;
  }

  let keys: string[] = opts.keys || [];

  if (opts.sortBy) {
    keys = opts.sortBy(obj);
    fn = null;
  }

  if (opts.keys) {
    if (!opts.sort && !opts.sortOrder && !opts.sortBy) {
      fn = null;
    }
  }

  const tmp: Record<string, unknown> = {};
  const sortBy: Record<string, string[]> = {};

  const build = keys.length === 0 ? fromObj : fromKeys;
  build(obj, keys, tmp, sortBy, function (val: unknown) {
    return getFn(val, prop);
  });

  if (fn) {
    keys.sort(fn);
  }

  let len = keys.length;
  let i = 0;
  let j = 0;
  const res: Record<string, unknown> = {};
  let prev: string | undefined;
  while (len--) {
    const key = keys[i++];
    if (prev !== key) j = 0;
    const k = (get(sortBy, key) as string[])[j++];
    res[k] = tmp[k];
    prev = key;
  }

  // Deep sort nested objects if requested
  if (opts.deep) {
    for (const key of Object.keys(res)) {
      if (isObject(res[key]) && !Array.isArray(res[key])) {
        res[key] = sort(res[key] as Record<string, unknown>, { deep: true });
      }
    }
  }

  return res as Partial<T>;
}

/** Build sorting information from the object itself. */
function fromObj(
  obj: Record<string, unknown>,
  keys: string[],
  tmp: Record<string, unknown>,
  sortBy: Record<string, string[]>,
  fn: (val: unknown) => unknown,
): void {
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    const val = obj[key];
    let item: unknown = isObject(val) ? fn(val) || key : key;
    item = isObject(item)
      ? bytewise.encode(JSON.stringify(item)).toString()
      : item;
    union(sortBy, item as string, [key]);
    keys.push(item as string);
    tmp[key] = val;
  }
}

/** Build sorting information from the supplied keys. */
function fromKeys(
  obj: Record<string, unknown>,
  keys: string[],
  tmp: Record<string, unknown>,
  sortBy: Record<string, string[]>,
): void {
  let len = keys.length;
  let i = 0;
  while (len--) {
    const key = keys[i++];
    const val = obj[key];
    union(sortBy, key, [key]);
    tmp[key] = val;
  }
}

export default sort;
