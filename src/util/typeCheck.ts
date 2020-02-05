import { Constructor } from './Util';

type TypeofResult = 'undefined' | 'boolean' | 'number' | 'bigint' | 'string' | 'symbol' | 'function' | 'object';
export function typeCheck(argument: unknown, typeToCheck: TypeofResult | Constructor<unknown>): argument is typeof typeToCheck {
  if (typeof typeToCheck === 'string') {
    if (typeof argument === typeToCheck) {
      return true;
    }
    return false;
  } if (typeof typeToCheck === 'object') {
    if (argument instanceof typeToCheck) {
      return true;
    }
    return false;
  }
  throw new Error('typeToCheck is invalid. Please report this error to the library author');
}
