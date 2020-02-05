import { Client } from './Client';

export declare class Collection<key, stores> extends Map<key, stores> {
  client: Client;

  constructor(client: Client, iterable?: readonly (readonly [key, stores])[]);

  first(): stores;

  firstKey(): key;

  last(count: number): stores | Array<stores>;

  lastKey(count: number): key | Array<key>;

  includes(search: stores): boolean;

  includesKey(search: key): boolean;

  filter(filterFunction: Function): Collection<key, stores>;

  filterKeys(filterFunction: Function): Collection<key, stores>;

  array(): Array<stores>;

  keyArray(): Array<key>;
}
