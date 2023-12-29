import { Fkt } from '../Common/Function'

export class RadioSetPreset2 extends Fkt {
  async status(data: Buffer) {
    console.log('preset update2', data)
  }
}
module.exports = RadioSetPreset2
