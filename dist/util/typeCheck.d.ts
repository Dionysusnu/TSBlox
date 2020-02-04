declare type TypeofResult = 'undefined' | 'boolean' | 'number' | 'bigint' | 'string' | 'symbol' | 'function' | 'object';
import { Constructor } from './Util';
export declare function typeCheck(argument: unknown, typeToCheck: TypeofResult | Constructor<unknown>): argument is typeof typeToCheck;
export {};
