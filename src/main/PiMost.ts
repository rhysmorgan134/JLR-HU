import { SocketMost, SocketMostClient } from 'socketmost'
import { Os8104Events, Stream } from "socketmost/dist/modules/Messages";
import { MessageNames, Socket } from "./Socket";
import { AudioDiskPlayer } from "./PiMostFunctions/AudioDiskPlayer/AudioDiskPlayer"

export class PiMost {
  socketMost: SocketMost
  socketMostClient: SocketMostClient
  socket: Socket
  audioDiskPlayer: AudioDiskPlayer
  constructor(socket: Socket) {
    console.log("creating client in PiMost")
    this.socketMost = new SocketMost()
    this.socketMostClient = new SocketMostClient()
    this.socket = socket
    this.socket.on(MessageNames.Stream, (stream) => {
      this.stream(stream)
    })
    this.audioDiskPlayer = new AudioDiskPlayer(0x02, this.socketMostClient.sendControlMessage, 0x01, 0x80, 0x01, 0x10)
    this.socketMostClient.on(Os8104Events.Locked, () => {
      this.audioDiskPlayer.allNotifcations()
    })
  }

  stream(stream: Stream) {
    this.socketMostClient.stream(stream)
  }

  subscribe() {
    // this.socketMostClient.sendControlMessage()
  }
}


