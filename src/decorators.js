"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = Log;
exports.MeasureTime = MeasureTime;
/**
 * Legacy TypeScript method decorator.
 * Enable "experimentalDecorators": true in tsconfig.json.
 */
function Log(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        console.log(`[CALL] ${String(propertyKey)}`, args);
        try {
            const result = originalMethod.apply(this, args);
            console.log(`[RETURN] ${String(propertyKey)}`, result);
            return result;
        }
        catch (error) {
            console.error(`[ERROR] ${String(propertyKey)}`, error);
            throw error;
        }
    };
}
function MeasureTime(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        const start = Date.now();
        try {
            return originalMethod.apply(this, args);
        }
        finally {
            console.log(`[TIME] ${String(propertyKey)}: ${Date.now() - start} ms`);
        }
    };
}
