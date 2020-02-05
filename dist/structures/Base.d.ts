import { Client } from './Client';

export declare class Base {
  readonly client: Client;

  readonly id: number;

  protected constructor(client: Client, id: number);

  valueOf(): number;
}
