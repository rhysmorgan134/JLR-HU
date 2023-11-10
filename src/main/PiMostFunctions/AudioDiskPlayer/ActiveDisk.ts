import { Fkt } from "../Common/Function";
import { FktIdPartMessage } from "../../Globals";

export class ActiveDisk extends Fkt {
  constructor(fktID: number, writeMessage: (message: FktIdPartMessage) => void, updateStatus: (result: Object) => void) {
    super(fktID, writeMessage, updateStatus);
  }

  async status(data, telLen) {
    let x = data.readUInt8(0);
    let status = {activeDisk: x } ;
    this.updateStatus(status);
    this.responseReceived = true;
  }
}
