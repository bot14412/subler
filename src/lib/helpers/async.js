/**
 * @template T
 * @template U
 * @param {Array<T>} array
 * @param {(value: T, index: number) => Promise<U>} callback
 * @returns {Promise<Array<U>>}
 */
export async function map(array, callback) {
  const promises = array.map((value, index) => callback(value, index));
  return await Promise.all(promises);
}

/**
 * @template T
 * @param {Array<T>} array
 * @param {(value: T, index: number) => Promise<boolean>} callback
 * @returns {Promise<boolean>}
 */
export async function some(array, callback) {
  const result = await map(array, callback);
  return result.includes(true);
}
