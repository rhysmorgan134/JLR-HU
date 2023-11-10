import { create } from 'zustand'
import { ExtraConfig } from "../../../main/Globals";
import { io } from 'socket.io-client'
import { Stream } from "socketmost/dist/modules/Messages";
import { produce } from 'immer'
import _ from 'lodash'
import {
  ACTIVE_DISK,
  NEXT_TRACK, PAUSE, PLAY,
  PREV_TRACK, RANDOM, REPEAT,

} from "../../../main/PiMostFunctions/AudioDiskPlayer/AudioDiskPlayerTypes";

interface CarplayStore {
  settings: null | ExtraConfig,
  saveSettings: (settings: ExtraConfig) => void
  getSettings: () => void
  stream: (stream: Stream) => void
}

interface AudioDiskPlayer {
  trackNumber: number,
  trackName: string,
  albumName: string,
  playTime: number,
  trackTime: number,
  deckState: string,
  shuffle: string,
  repeat: string,
  disks: {},
  nextTrack: () => void,
  prevTrack: () => void,
  play: () => void,
  pause: () => void,
  setRepeat: (repeatType: string) => void,
  setRandom: (randomType: string) => void,
  setActiveDisk: (activeDisk: number) => void
}

interface Volume {
  audioVolume: number
  parkingVolume: number
  navigationVolume: number
  phoneVolume: number
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

export const useVolumeStore = create<Volume>()(() => ({
  audioVolume: 0,
  parkingVolume: 0,
  navigationVolume: 0,
  phoneVolume: 0
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

export const useAudioDiskPlayer = create<AudioDiskPlayer>()(() => ({
  trackNumber: 0,
  trackName: 'no name available',
  trackTime: 0,
  albumName: 'no name available',
  playTime: 0,
  repeat: '',
  shuffle: '',
  deckState: 'loading',
  disks: {},
  nextTrack: () => {
    console.log("next track")
    socket.emit('action', NEXT_TRACK)
  },
  prevTrack: () =>  {
    socket.emit('action', PREV_TRACK)
  },
  play: () => {
    socket.emit('action', PLAY)
  },
  pause: () => {
    socket.emit('action', PAUSE)
  },
  setRandom: (randomType) => {
    socket.emit('action', RANDOM(randomType))
  },
  setRepeat: (repeatType) => {
    socket.emit('action', REPEAT(repeatType))
  },
  setActiveDisk: (activeDisk) => {
    console.log("active disk")
    socket.emit('action', ACTIVE_DISK(activeDisk))
  }
}))

const URL = 'http://localhost:4000'
const socket = io(URL)

socket.on('settings', (settings: ExtraConfig) => {
  console.log("received settings", settings)
  useCarplayStore.setState(() => ({settings: settings}))
})

socket.on('audioDiskPlayerUpdate', (data) => {
  // for(const [k, v] of Object.entries(data)) {
  //   console.log(k, v)
  //   useAudioDiskPlayer.setState(produce((state: AudioDiskPlayer) => (state[k] = v)))
  // }
  // console.log(useAudioDiskPlayer.getState())
  useAudioDiskPlayer.setState((state) => {
    return produce(state, draft => {
      _.merge(draft, data)
    })
  })
})

socket.on('volumeUpdate', (data) => {
  for(const [k, v] of Object.entries(data)) {
    useVolumeStore.setState(() => ({[k]: v}))
  }
})

socket.on('volumeFullUpdate', (data) => {
  useVolumeStore.setState(() => (data))
})

socket.on('audioDiskPlayerFullUpdate', (data) => {
  useAudioDiskPlayer.setState(() => (data))
})




