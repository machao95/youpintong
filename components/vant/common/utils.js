function isDef(value) {
    return value !== undefined && value !== null;
}
function isObj(x) {
    const type = typeof x;
    return x !== null && (type === 'object' || type === 'function');
}
function isNumber(value) {
    return /^\d+$/.test(value);
}
function range(num, min, max) {
    return Math.min(Math.max(num, min), max);
}
function addUnit(value) {
    if (!isDef(value)) {
        return undefined;
    }
    value = String(value);
    // return isNumber(value) ? `${value}px` : value;
    return `${value}px`
}
export { isObj, isDef, isNumber, range, addUnit };
