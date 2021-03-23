/**
 * 符合LYH规范的Premise实例
 * LYH规范：
 *  1. 编译不报错
 *  2. 基本可运行
 *  3. .then方法符合预期，可以链式调用
 * 你可以看到，基于LYH规范的Premise甚至没有规范的fulfilled pending rejected名字
 * 但这并不能成为阻碍正常运行的理由！！
 */
class Premise {
  constructor(fn) {
    this._result = null
    this._reason = null
    this._state = "pending"
    this._resolve = this._resolve.bind(this)
    this._resolveCallBack = function(){}
    this._reject = this._reject.bind(this)
    this._rejectCallBack = function(){}
    fn(this._resolve, this._reject)
  }
  _resolve(res) {
    if(this._state === "pending") {
      this._state = "resolve"
      this._result = res
      this._resolveCallBack(res)
    } else {
      console.error("immutable state in Premise!");
    }
  }
  _reject(rej) {
    if(this._state === "pending") {
      this._state = "reject"
      this._reason = rej
      this._rejectCallBack(rej)
    } else {
      console.error("immutable state in Premise!");
    }
  }
  then(resolveCall, rejectCall) {
    const prePremise = this
    return new Premise((resolve, reject) => {
      setTimeout(() => {
        let currentPremiseResult
        switch (prePremise._state) {
          case "pending":
            prePremise._resolveCallBack = function(res) {
              const currentPremiseResult = resolveCall(prePremise._result)
              if(currentPremiseResult && currentPremiseResult.then) {
                switch (currentPremiseResult._state) {
                  case "pending":
                    currentPremiseResult._resolveCallBack = function(res) {
                      resolve(res)
                    }
                    currentPremiseResult._rejectCallBack = function(rej) {
                      reject(rej)
                    }
                    break
                  case "resolve":
                    resolve(currentPremiseResult._result)
                    break
                  case "reject":
                    reject(currentPremiseResult._reason)
                    break
                  default:
                    break
                }
              } else {
                resolve(currentPremiseResult)
              }
            }
            prePremise._rejectCallBack = function(rej) {
              const currentPremiseResult = rejectCall(prePremise._reason)
              if(currentPremiseResult.then) {
                switch (currentPremiseResult._state) {
                  case "pending":
                    currentPremiseResult._resolveCallBack = function(rej) {
                      resolve(rej)
                    }
                    currentPremiseResult._rejectCallBack = function(rej) {
                      reject(rej)
                    }
                    break
                  case "resolve":
                    resolve(currentPremiseResult._result)
                    break
                  case "reject":
                    reject(currentPremiseResult._reason)
                    break
                  default:
                    break
                }
              } else {
                reject(currentPremiseResult)
              }
            }
            break
          case "resolve":
            currentPremiseResult = resolveCall(prePremise._result)
            if(currentPremiseResult.then) {
              switch (currentPremiseResult._state) {
                case "pending":
                  currentPremiseResult._resolveCallBack = function(res) {
                    resolve(res)
                  }
                  currentPremiseResult._rejectCallBack = function(rej) {
                    reject(rej)
                  }
                  break
                case "resolve":
                  resolve(currentPremiseResult._result)
                  break
                case "reject":
                  reject(currentPremiseResult._reason)
                  break
              }
            } else {
              resolve(prePremise._result)
            }
            break
          case "reject":
            currentPremiseResult = rejectCall(prePremise._reason)
            if(currentPremiseResult._state) {
              switch (currentPremiseResult._state) {
                case "pending":
                  break
                case "resolve":
                  break
                case "reject":
                  break
              }
            } else {
              reject(prePremise._reason)
            }
            break
        }
      })
    })
  }
}
const p = new Premise((resolve, reject) => {
  console.log("1")
  resolve("1 finished")
}).then(res => new Premise((resolve, reject) => {
  console.log(res)
  setTimeout(() => {
    console.log("2")
    resolve("2 finished")
  }, 1000);
})).then((res) => console.log(res))