const arrayLike = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3
}
const arr = Array.prototype.slice.apply(arrayLike, [0, 1])
console.log(arr)