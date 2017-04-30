export default {
  probabilities: {
    Empty: 0.35,
    Up:  0.1,
    Down: 0.1,
    Boss: 0.025,
    Spawner: 0.075,
    Monster: 0.2,
    Treasure: 0.15
  },
  required: ['Up','Down'],
  defaultType: 'Empty',
  defaultRoomSize: {width:4,height:4}
}