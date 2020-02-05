import { Constructor } from './Util';

declare type TypeofResult = 'undefined' | 'boolean' | 'number' | 'bigint' | 'string' | 'symbol' | 'function' | 'object';
export declare function typeCheck(argument: unknown, typeToCheck: TypeofResult | Constructor<unknown>): argument is typeof typeToCheck;
export {};
