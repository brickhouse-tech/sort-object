declare module "is-extendable" {
  function isExtendable(val: unknown): val is Record<string, unknown>;
  export = isExtendable;
}

declare module "sort-desc" {
  function sortDesc(a: string, b: string): number;
  export = sortDesc;
}

declare module "sort-asc" {
  function sortAsc(a: string, b: string): number;
  export = sortAsc;
}

declare module "bytewise" {
  const bytewise: {
    encode(val: unknown): Buffer;
    decode(buf: Buffer): unknown;
  };
  export = bytewise;
}

declare module "@znemz/union-value" {
  function union(obj: Record<string, unknown>, key: string, val: unknown[]): void;
  export = union;
}

declare module "get-value" {
  function get(obj: unknown, key: string): unknown;
  export = get;
}
