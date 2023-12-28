import { Fkt } from '../Common/Function'
import { FktIdPartMessage } from '../../Globals'

export class DeckStatus extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }

  async status(data: Buffer, telLen: number) {
    const x = data.readUInt8(0)
    const status: { deckState?: string } = {}
    switch (x) {
      case 0x00:
        status.deckState = 'Play'
        break
      case 0x01:
        status.deckState = 'Stop'
        break
      case 0x02:
        status.deckState = 'Pause'
        break
      case 0x03:
        status.deckState = 'Load'
        break
      case 0x04:
        status.deckState = 'Unload'
        break
      case 0x05:
        status.deckState = 'Search Forward'
        break
      case 0x06:
        status.deckState = 'Search Backward'
        break
      case 0x07:
        status.deckState = 'Fast Forward By Time'
        break
      case 0x08:
        status.deckState = 'Fast Back By Time'
        break
      case 0x09:
        status.deckState = 'Empty'
        break
      case 0x0a:
        status.deckState = 'Retract'
        break
      case 0x20:
        status.deckState = 'Slow Forward'
        break
      case 0x21:
        status.deckState = 'Slow Backward'
        break
      case 0x22:
        status.deckState = 'Step By Step'
        break
      case 0x23:
        status.deckState = 'PreStop'
        break
      case 0x30:
        status.deckState = 'Rewind To Start'
        break
      case 0x31:
        status.deckState = 'Forward To End'
        break
      case 0x32:
        status.deckState = 'Search Start Position Next'
        break
      case 0x33:
        status.deckState = 'Search Start Position Last'
        break
      case 0x40:
        status.deckState = 'File Play'
        break
      case 0x41:
        status.deckState = 'File Transfer'
        break
    }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
