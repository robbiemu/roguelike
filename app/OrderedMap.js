export default {
  arrayMap: [],
  entryMap: function () { 
    return this.arrayMap.reduce((p,c) => Object.assign(p,c),{}) 
    
  },
  indexOf: function (key) {
    let i = 0; 
    let found = this.arrayMap.some(e => {
      if (Object.keys(e)[0] === key)
        return true
      i++
    })
    return found? i: -1
  }
}