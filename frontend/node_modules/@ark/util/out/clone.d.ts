/** Shallowly copy the properties of the object. */
export declare const shallowClone: <input extends object>(input: input) => input;
/** Deeply copy the properties of the a non-subclassed Object, Array or Date.
 *
 * @param input The object to clone
 *
 * @returns A new deeply cloned version of the object, or the original object
 * if it has a prototype other than Object, Array Date, or null.
 */
export declare const deepClone: <input extends object>(input: input) => input;
