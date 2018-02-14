
export function array2Object(arr) {
  return arr.reduce((acc, cur, i) => { acc[i] = cur; return acc; }, {});
}

export function object2Array(obj) {
  return Object.keys(obj).map(key => obj[key]);
}

export default {
  array2Object: array2Object,
  object2Array: object2Array,
};
