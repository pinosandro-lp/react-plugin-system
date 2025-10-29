/** Deeply freezes an object, making it and all nested objects immutable.
 *
 * @param obj - The object to be deeply frozen.
 * @returns The deeply frozen object.
 */
export function deepFreeze<T extends object>(obj: T): Readonly<T> {
  Object.keys(obj).forEach(p => {
    if (
      (p in obj && typeof (obj as { [p]: unknown })[p] === 'object') ||
      typeof (obj as { [p]: unknown })[p] === 'function'
    ) {
      deepFreeze((obj as { [p]: object })[p]);
    }
  });

  return Object.freeze(obj);
}
