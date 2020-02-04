type TypeofResult = 'undefined' | 'boolean' | 'number' | 'bigint' | 'string' | 'symbol' | 'function' | 'object';
import { Constructor } from './Util';
export function typeCheck(argument: unknown, typeToCheck: TypeofResult | Constructor<unknown>): argument is typeof typeToCheck {
	if (typeof typeToCheck === 'string') {
		if (typeof argument === typeToCheck) {
			return true;
		} else {
			return false;
		}
	} else if (typeof typeToCheck === 'object') {
		if (argument instanceof typeToCheck) {
			return true;
		} else {
			return false;
		}
	} else {
		throw new Error('typeToCheck is invalid. Please report this error to the library author');
	}
}