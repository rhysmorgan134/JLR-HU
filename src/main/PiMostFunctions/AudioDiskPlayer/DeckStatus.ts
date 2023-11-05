import { Fkt } from '../Common/Function'
import { FktIdPartMessage } from '../../Globals'

export class DeckStatus extends Fkt {

  writeMessage: (message: FktIdPartMessage) => void
  fktID: number
  updateStatus: (result: Object) => void

  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: Object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }

  async status(data, telLen) {
    console.log(data, telLen)
    let x = data.readUInt8(0)
    let status = { deck: {} }
    switch (x) {
      case 0x00:
        status.deck.state = 'Play'
        break
      case 0x01:
        status.deck.state = 'Stop'
        break
      case 0x02:
        status.deck.state = 'Pause'
        break
      case 0x03:
        status.deck.state = 'Load'
        break
      case 0x04:
        status.deck.state = 'Unload'
        break
      case 0x05:
        status.deck.state = 'Search Forward'
        break
      case 0x06:
        status.deck.state = 'Search Backward'
        break
      case 0x07:
        status.deck.state = 'Fast Forward By Time'
        break
      case 0x08:
        status.deck.state = 'Fast Back By Time'
        break
      case 0x09:
        status.deck.state = 'Empty'
        break
      case 0x0a:
        status.deck.state = 'Retract'
        break
      case 0x20:
        status.deck.state = 'Slow Forward'
        break
      case 0x21:
        status.deck.state = 'Slow Backward'
        break
      case 0x22:
        status.deck.state = 'Step By Step'
        break
      case 0x23:
        status.deck.state = 'PreStop'
        break
      case 0x30:
        status.deck.state = 'Rewind To Start'
        break
      case 0x31:
        status.deck.state = 'Forward To End'
        break
      case 0x32:
        status.deck.state = 'Search Start Position Next'
        break
      case 0x33:
        status.deck.state = 'Search Start Position Last'
        break
      case 0x40:
        status.deck.state = 'File Play'
        break
      case 0x41:
        status.deck.state = 'File Transfer'
        break
    }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
