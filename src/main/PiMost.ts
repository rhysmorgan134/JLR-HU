import { SocketMost, SocketMostClient } from 'socketmost'
import { Os8104Events, RawMostRxMessage, SocketMostSendMessage, Stream } from "socketmost/dist/modules/Messages";
import { MessageNames, Socket } from "./Socket";
import { AudioDiskPlayer } from "./PiMostFunctions/AudioDiskPlayer/AudioDiskPlayer"
import { fBlocks, opTypes } from './PiMostFunctions/Common/enums'
import { Action } from "./Globals";
import { u240 } from './PiMostFunctions/JlrAudio/u240'

export class PiMost {
  socketMost: SocketMost
  socketMostClient: SocketMostClient
  socket: Socket
  interfaces: {
    AudioDiskPlayer?: AudioDiskPlayer
    u240?: u240
  }
  stabilityTimeout: null | NodeJS.Timeout
  constructor(socket: Socket) {
    console.log("creating client in PiMost")
    this.socketMost = new SocketMost()
    this.socketMostClient = new SocketMostClient()
    this.socket = socket
    this.socket.on(MessageNames.Stream, (stream) => {
      this.stream(stream)
    })
    this.interfaces = {}
    this.stabilityTimeout = null


    this.socketMostClient.on('connected', () => {
      this.interfaces.AudioDiskPlayer = new AudioDiskPlayer(0x02, this.sendMessage.bind(this), 0x01, 0x80, 0x01, 0x10)
      this.interfaces.u240 = new u240(0x01, this.sendMessage.bind(this), 0x01, 0x61, 0x01, 0x10)
      this.interfaces.AudioDiskPlayer.on('statusUpdate', (data) => {
        socket.sendStatusUpdate('audioDiskPlayerUpdate', data)
      })
      this.interfaces.u240.on('statusUpdate', (data) => {
        socket.sendStatusUpdate('volumeUpdate', data)
      })

      socket.on('newConnection', () => {
        console.log("SENDING FULL UPDATE")
        socket.sendStatusUpdate('audioDiskPlayerFullUpdate', this.interfaces.AudioDiskPlayer!.state)
        socket.sendStatusUpdate('volumeFullUpdate', this.interfaces.u240!.state)
      })

      socket.on('action', (message: Action) => {
        console.log("action request", message)
        const {fktId, opType, type, data, method} = message
        const opTypeString = opTypes[method][opType]
        this.interfaces[type].functions[fktId].actionOpType[opTypeString](data)
      })

      this.socketMostClient.on(Os8104Events.Locked, () => {
        this.stabilityTimeout = setTimeout(() => {
          console.log("locked, subscribing")
          this.interfaces.AudioDiskPlayer!.allNotifcations()
          this.interfaces.u240!.allNotifcations()
        }, 2000)
      })

      this.socketMostClient.on(Os8104Events.Unlocked, () => {
        console.log("UNLOCKED")
        clearTimeout(this.stabilityTimeout!)
      })

      this.socketMostClient.on(Os8104Events.SocketMostMessageRxEvent, (message: RawMostRxMessage) => {
        const type = fBlocks[message.fBlockID]
        if(message.opType === 15) {
          console.log("most error", message)
        }
        this.interfaces?.[type]?.parseMessage(message)
      })
    })
  }

  stream(stream: Stream) {
    this.socketMostClient.stream(stream)
  }

  sendMessage(message: SocketMostSendMessage) {
    console.log("send message request", message)
    this.socketMostClient.sendControlMessage(message)
  }

  subscribe() {
    // this.socketMostClient.sendControlMessage()
  }
}


