import { Fkt } from '../Common/Function'

export class SetSource extends Fkt {
  // /**
  //  *
  //  * @param {Buffer} data
  //  * @param {number} telLen
  //  * @returns {Promise<void>}
  //  */
  async status(data: Buffer, _telLen: number) {
    console.log('set source unknown', data)
  }
}
