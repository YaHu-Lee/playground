const fs = require("fs")
let buffer = fs.readFileSync("./target.ts")
let charArray = Array.from(buffer.toString())
const matchReg = {
  "identifier:{": /^\{$/,
  "identifier:}": /^\}$/,
  "identifier:(": /^\($/,
  "identifier:)": /^\)$/,
  "identifier::": /^\:$/,
  "identifier:,": /^\,$/,
  "identifier:+": /^\+$/,
  "variable"    : /^[a-zA-Z]+$/,
  "space"       : /^\s+$/,
  // "unfinished:'": /^'[^']*$/,
  // "identifier:''": /^'[^']*'$/,
  "key:class": /^class$/,
  "key:return": /^return$/,
}
function lexLoop(charArray) {
  arr = [...charArray]
  let result = [] // 处理完的标识符
  let store = ''  // 当前处理的部分字符串
  let currentMatch = undefined
  function spliceAndMatch() {
    const char = arr.shift()
    if(char == undefined) return
    store += char // 吃一个字符
    console.log(store)
    if(store == '')return     // 如果没吃的就退出
    let flag = false          // 插旗，看看能否匹配上
    for (const key in matchReg) {
      if(matchReg[key].test(store)) {
        console.log(key)
        currentMatch = key    // 匹配上了就记住
        flag = true           // 并且点亮棋子🚩
      }
    }
    if(flag) {
      flag = false
    } else {
      if(!currentMatch) {
        console.error("no match")
        return
      }
      result.push(currentMatch) // 没匹配上，说明已经结束，把之前匹配的结果推入
      currentMatch = undefined
      arr.unshift(store[store.length - 1]) // 把吃的字符重新吐出来
      store = ''         // 把当前处理的置空
    }
    return spliceAndMatch()
  }
  spliceAndMatch()
  return result
}
console.log(lexLoop(charArray))