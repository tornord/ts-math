/**
 * The factorial of n.
 */
export function fact(n: number): number {
  var res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

/**
 * Rotate the elements in array from index n to m. Example [0,1,2,3,4,5], 2,4 => [0,1,4,2,3,5]
 * @param {Array} arr - The array to rotate
 * @param {int} n - Start index
 * @param {int} m - End Index (including)
 */
 export function rotate(arr: number[], n: number, m: number): void {
  let s = arr[m];
  for (let i = m - 1; i >= n; i--) {
    arr[i + 1] = arr[i];
  }
  arr[n] = s;
}

/**
 * Permutes an array.
 * @param {*} arr - The array to permute
 * @param {*} idx - The permutation index. An index between 0 and fact(arr.length)-1
 */
 export function permute(arr: number[], idx: number): number[] {
  var i = 0;
  var d = fact(arr.length - 1);
  var r = idx;
  var n;

  while (i < arr.length - 1) {
    n = r;
    r %= d;
    n = (n - r) / d;
    rotate(arr, i, i + n);
    i++;
    d /= arr.length - i;
  }
  rotate(arr, i, i + r);
  return arr;
}
