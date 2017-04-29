export default {
  probabilities: {
    Empty: 0.4,
    Up:  0.1,
    Down: 0.1,
    Boss: 0.05,
    Spawner: 0.1,
    Monster: 0.2,
    Treasure: 0.05
  },
  required: ['Up','Down'],
  defaultType: 'Empty',
  defaultRoomSize: {width:4,height:4}
}