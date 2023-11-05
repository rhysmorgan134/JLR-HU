import { create } from 'zustand'
import { ExtraConfig } from "../../../main/Globals";
import { io } from 'socket.io-client'
import { Stream } from "socketmost/dist/modules/Messages";

interface CarplayStore {
  settings: null | ExtraConfig,
  saveSettings: (settings: ExtraConfig) => void
  getSettings: () => void
  stream: (stream: Stream) => void
}

interface StatusStore {
  reverse: boolean,
  lights: boolean,
}

interface AudioDiskPlayer {
  trackNumber: number,
  trackName: string,
  albumName: string,
  playTime: number,
  trackTime: number,
  deckState: number
}

export const useCarplayStore = create<CarplayStore>()((set) =>({
  settings: null,
  saveSettings: (settings) => {
    set(() => ({settings: settings}))
    socket.emit('saveSettings', settings)
  },
  getSettings: () => {
    socket.emit('getSettings')
  },
  stream: (stream) => {
    socket.emit('stream', stream)
  }
}))

export const socketActions = create(() => {
  return {
    actions: {
      sendMessage(functionName, type, data=[]) {
        console.log("sending", functionName, type, data)
        socket.emit("runFkt", {type: type, functionName: functionName, data: data})
      }
    }
  }
})

export const useAudioDiskPlayer = create<AudioDiskPlayer>()((set) => ({
  trackNumber: 0,
  trackName: 'no name available',
  trackTime: 0,
  albumName: 'no name available',
  playTime: 0,
  deckState: 0
}))

const URL = 'http://localhost:4000'
const socket = io(URL)

socket.on('settings', (settings: ExtraConfig) => {
  console.log("received settings", settings)
  useCarplayStore.setState(() => ({settings: settings}))
})




