import Client from './Client';
/**
 * Class to store objects with ID
 */
export default class Collection<key, stores> extends Map<key, stores> {
  public client: Client;

  public constructor(client: Client, iterable?: readonly (readonly [key, stores])[]) {
    super(iterable);
    if (iterable) {
      iterable.forEach((item) => {
        this.set(item[0], item[1]);
      });
    }
    this.client = client;
  }

  public first(): stores {
    return this.values().next().value;
  }

  public firstKey(): key {
    return this.keys().next().value;
  }

  public last(count: number): stores | Array<stores> {
    if (count !== undefined && typeof count !== 'number') throw new TypeError();
    const arr = this.array();
    if (count === undefined) {
      return arr[arr.length - 1];
    }
    return arr.slice(-count);
  }

  public lastKey(count: number): key | Array<key> {
    if (count !== undefined && typeof count !== 'number') throw new TypeError();
    const arr = this.keyArray();
    if (count === undefined) {
      return arr[arr.length - 1];
    }
    return arr.slice(-count);
  }

  /**
   * Returns true if the object is in this collection
   * @param {Object} search The object to search for
   * @returns {boolean} Whether the object was found
   */
  public includes(search: stores): boolean {
    return this.array().some((item) => item === search);
  }

  public includesKey(search: key): boolean {
    return this.keyArray().some((item) => item === search);
  }

  public filter(filterFunction: Function): Collection<key, stores> {
    const filtered = new Collection<key, stores>(this.client);
    this.forEach((object, id) => {
      if (filterFunction(object)) {
        filtered.set(id, object);
      }
    });
    return filtered;
  }

  public filterKeys(filterFunction: Function): Collection<key, stores> {
    const filtered = new Collection<key, stores>(this.client);
    this.forEach((object, id) => {
      if (filterFunction(id)) {
        filtered.set(id, object);
      }
    });
    return filtered;
  }

  public array(): Array<stores> {
    return [...this.values()];
  }

  public keyArray(): Array<key> {
    return [...this.keys()];
  }
}
