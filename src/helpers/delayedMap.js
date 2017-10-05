// calls a function on each item in an array every x milliseconds
const throttleMap = (ms, arr=[], fn) => {
  const len = arr.length
  let i = 0
  const loop = (data) => {
    setTimeout(() => {
      i++
      data && fn(data)
      if(i < len) loop(arr[i])
    }, ms)
  }
  loop(arr[i])
}

module.exports = throttleMap
