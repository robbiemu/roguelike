export const atRandom = function () { 
  return this[~~(Math.random() * (this.length))] 
}