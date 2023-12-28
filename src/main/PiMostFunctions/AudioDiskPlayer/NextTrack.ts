import { Fkt } from '../Common/Function'

export class NextTrack extends Fkt {
  async status(data: Buffer, _telLen: number) {
    console.log('next track data: ', data)
  }
}
