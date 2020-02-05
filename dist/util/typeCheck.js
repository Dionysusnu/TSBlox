"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function typeCheck(argument, typeToCheck) {
    if (typeof typeToCheck === 'string') {
        if (typeof argument === typeToCheck) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (typeof typeToCheck === 'object') {
        if (argument instanceof typeToCheck) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        throw new Error('typeToCheck is invalid. Please report this error to the library author');
    }
}
exports.typeCheck = typeCheck;
