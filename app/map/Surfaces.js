import OrderedMap from '../OrderedMap.js'

export default Object.assign({}, OrderedMap, {  
  arrayMap: [
    {unknown: '#000000'},
    {passage: '#aaaaaa'},
    {room: '#999999'},
    {'stairs up': '#dddddd'},
    {'stairs down': '#dddddd'}
  ],
  altNames: {
    Up: 'stairs up',
    Down: 'stairs down'
  }
})
