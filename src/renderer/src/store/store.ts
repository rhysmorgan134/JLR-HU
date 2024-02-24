import { create } from 'zustand'
import { ExtraConfig, ParkingSensors } from '../../../main/Globals'
import { io } from 'socket.io-client'
import { messages } from 'socketmost'

import { produce } from 'immer'
import _ from 'lodash'
import {
  ACTIVE_DISK,
  NEXT_TRACK,
  PAUSE,
  PLAY,
  PREV_TRACK,
  RANDOM,
  REPEAT
} from '../../../main/PiMostFunctions/AudioDiskPlayer/AudioDiskPlayerTypes'
import {
  AUTO_STORE,
  CHANGE_STATION,
  GET_PRESETS,
  PresetList,
  SAVE_STATION,
  SEEK_BACK,
  SEEK_FORWARD,
  SET_PRESET_GROUP,
  SET_PRESET_GROUP1
} from '../../../main/PiMostFunctions/AmFm/AmFmTunerTypes'
import {
  SET_BALANCE,
  SET_BASS,
  SET_CENTRE,
  SET_FADER,
  SET_MODE,
  SET_SUBWOOFER,
  SET_TREBLE,
  SurroundEntry
} from '../../../main/PiMostFunctions/Amplifier/AmplifierTypes'

interface CanGatewayStore {
  hours: number
  minutes: number
  parkingSensors: ParkingSensors
  externalTemp: number
  ambientLight: number
  lights: boolean
  parkingActive: boolean
  newSwitch: (source: string) => void
}

interface CarplayStore {
  settings: null | ExtraConfig
  saveSettings: (settings: ExtraConfig) => void
  getSettings: () => void
  stream: (stream: messages.Stream) => void
  showSettings: boolean
  setShowSettings: (show: boolean) => void
  reverse: boolean
  setReverse: (reverse: boolean) => void
}

interface ClimateStore {
  leftTemp: number
  rightTemp: number
  recirc: boolean
  auto: boolean
  maxDefrost: boolean
  fanSpeed: number
}

interface Amplifier {
  balance: number
  bass: number
  treble: number
  subwoofer: number
  centre: number
  fader: number
  mode: SurroundEntry
  setBalance: (balance: number) => void
  setBass: (bass: number) => void
  setTreble: (treble: number) => void
  setSubwoofer: (subwoofer: number) => void
  setCentre: (mode: SurroundEntry, centre: number) => void
  setFader: (fader: number) => void
  setMode: (mode: SurroundEntry) => void
}

interface AudioDiskPlayer {
  trackNumber: number
  trackName: string
  albumName: string
  playTime: number
  trackTime: number
  deckState: string
  shuffle: string
  repeat: string
  disks: object
  nextTrack: () => void
  prevTrack: () => void
  play: () => void
  pause: () => void
  setRepeat: (repeatType: string) => void
  setRandom: (randomType: string) => void
  setActiveDisk: (activeDisk: number) => void
  allocate: () => void
}

interface AmFmTuner {
  currentPreset: number
  frequency: number
  presetList?: PresetList
  chosenPreset: 0
  currentStation: string
  autoStore: boolean
  getPresets: () => void
  startAutoStore: () => void
  setPresetGroup: (prevPreset: number, PresetGroupType: string) => void
  changeStation: (preset: number, station: number) => void
  saveStation: (preset: number, station: number) => void
  seekForward: () => void
  seekBack: () => void
}

interface Volume {
  audioVolume: number
  parkingVolume: number
  navigationVolume: number
  phoneVolume: number
}

export const useCanGatewayStore = create<CanGatewayStore>()(() => ({
  hours: 0,
  minutes: 0,
  parkingSensors: {
    frontLeft: 0,
    frontCentreLeft: 0,
    frontCentreRight: 0,
    frontRight: 0,
    rearLeft: 0,
    rearCentreLeft: 0,
    rearCentreRight: 0,
    rearRight: 0
  },
  externalTemp: 0,
  ambientLight: 0,
  lights: false,
  parkingActive: false,
  newSwitch: (source: string) => {
    socket.emit('newSwitch', source)
  }
}))

export const useCarplayStore = create<CarplayStore>()((set) => ({
  settings: null,
  saveSettings: (settings) => {
    set(() => ({ settings: settings }))
    socket.emit('saveSettings', settings)
  },
  getSettings: () => {
    socket.emit('getSettings')
  },
  stream: (stream) => {
    socket.emit('stream', stream)
  },
  showSettings: false,
  setShowSettings: (show) => {
    set(() => ({ showSettings: show }))
  },
  reverse: false,
  setReverse: (reverse) => {
    set(() => ({ reverse: reverse }))
  }
}))

export const useAmplifierStore = create<Amplifier>()((_set) => ({
  bass: 0,
  setBass: (bass) => {
    socket.emit('action', SET_BASS(bass))
  },
  treble: 0,
  setTreble: (treble) => {
    console.log('in store treble')
    socket.emit('action', SET_TREBLE(treble))
  },
  balance: 0,
  setBalance: (balance) => {
    socket.emit('action', SET_BALANCE(balance))
  },
  subwoofer: 0,
  setSubwoofer: (subwoofer) => {
    socket.emit('action', SET_SUBWOOFER(subwoofer))
  },
  centre: 0,
  setCentre: (mode, centre) => {
    socket.emit('action', SET_CENTRE(mode, centre))
  },
  mode: 'stereo',
  setMode: (mode) => {
    socket.emit('action', SET_MODE(mode))
  },
  fader: 0,
  setFader: (fader) => {
    socket.emit('action', SET_FADER(fader))
  }
}))

export const useAmFmStore = create<AmFmTuner>()((_set) => ({
  currentPreset: 0,
  frequency: 90000,
  currentStation: '',
  chosenPreset: 0,
  autoStore: false,
  getPresets: () => {
    console.log('getting presets')
    socket.emit('action', GET_PRESETS)
  },
  startAutoStore: () => {
    socket.emit('action', AUTO_STORE)
  },
  setPresetGroup: (prevPreset, preset) => {
    console.log('setting preset', preset)
    socket.emit('action', SET_PRESET_GROUP1(prevPreset))
    socket.emit('action', SET_PRESET_GROUP(prevPreset, preset))
  },
  changeStation: (preset: number, station: number) => {
    socket.emit('action', CHANGE_STATION(preset, station))
  },
  saveStation: (preset: number, station: number) => {
    socket.emit('action', SAVE_STATION(preset, station))
  },
  seekForward: () => {
    socket.emit('action', SEEK_FORWARD)
  },
  seekBack: () => {
    socket.emit('action', SEEK_BACK)
  }
}))

export const useVolumeStore = create<Volume>()(() => ({
  audioVolume: 0,
  parkingVolume: 0,
  navigationVolume: 0,
  phoneVolume: 0
}))

export const useClimateStore = create<ClimateStore>()(() => ({
  leftTemp: 0,
  rightTemp: 0,
  recirc: false,
  auto: false,
  maxDefrost: false,
  fanSpeed: 0
}))

export const socketActions = create(() => {
  return {
    actions: {
      sendMessage(functionName: string, type: string, data = []) {
        console.log('sending', functionName, type, data)
        socket.emit('runFkt', { type: type, functionName: functionName, data: data })
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
    console.log('next track')
    socket.emit('action', NEXT_TRACK)
  },
  prevTrack: () => {
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
    console.log('active disk')
    socket.emit('action', ACTIVE_DISK(activeDisk))
  },
  allocate: () => {
    console.log('sending allocate')
    socket.emit('allocate', 'AudioDiskPlayer')
  }
}))

const URL = 'http://localhost:4000'
const socket = io(URL)

socket.on('settings', (settings: ExtraConfig) => {
  console.log('received settings', settings)
  useCarplayStore.setState(() => ({ settings: settings }))
})

socket.on('audioDiskPlayerUpdate', (data) => {
  // for(const [k, v] of Object.entries(data)) {
  //   console.log(k, v)
  //   useAudioDiskPlayer.setState(produce((state: AudioDiskPlayer) => (state[k] = v)))
  // }
  // console.log(useAudioDiskPlayer.getState())
  useAudioDiskPlayer.setState((state) => {
    return produce(state, (draft) => {
      _.merge(draft, data)
    })
  })
})

socket.on('amFmTunerUpdate', (data) => {
  // for(const [k, v] of Object.entries(data)) {
  //   console.log(k, v)
  //   useAudioDiskPlayer.setState(produce((state: AudioDiskPlayer) => (state[k] = v)))
  // }
  // console.log(useAudioDiskPlayer.getState())
  useAmFmStore.setState((state) => {
    return produce(state, (draft) => {
      _.merge(draft, data)
    })
  })
  //console.log(useAmFmStore.getState())
})

socket.on('amplifierUpdate', (data) => {
  // for(const [k, v] of Object.entries(data)) {
  //   console.log(k, v)
  //   useAudioDiskPlayer.setState(produce((state: AudioDiskPlayer) => (state[k] = v)))
  // }
  // console.log(useAudioDiskPlayer.getState())
  useAmplifierStore.setState((state) => {
    return produce(state, (draft) => {
      _.merge(draft, data)
    })
  })
  //console.log(useAmFmStore.getState())
})
let parkingTimeout
socket.on('canGatewayUpdate', (data) => {
  useCanGatewayStore.setState((state) => {
    return produce(state, (draft) => {
      _.merge(draft, data)
    })
  })
  if ('parkingSensors' in data) {
    console.log('parking message', useCanGatewayStore.getState().parkingActive)
    if (!useCanGatewayStore.getState().parkingActive) {
      useCanGatewayStore.setState((state) => ({ ...state, parkingActive: true }))
    }
    if (parkingTimeout) {
      clearTimeout(parkingTimeout)
    }
    parkingTimeout = setTimeout(() => {
      useCanGatewayStore.setState((state) => ({ ...state, parkingActive: false }))
    }, 1000)
  }
})

socket.on('volumeUpdate', (data) => {
  for (const [k, v] of Object.entries(data)) {
    useVolumeStore.setState(() => ({ [k]: v }))
  }
})

socket.on('climateUpdate', (data) => {
  console.log('received climate', data)
  for (const [k, v] of Object.entries(data)) {
    useClimateStore.setState(() => ({ [k]: v }))
  }
})

socket.on('volumeFullUpdate', (data) => {
  useVolumeStore.setState(() => data)
})

socket.on('audioDiskPlayerFullUpdate', (data) => {
  useAudioDiskPlayer.setState(() => data)
})

socket.on('amplifierFullUpdate', (data) => {
  useAmplifierStore.setState(() => data)
})

socket.on('amFmTunerFullUpdate', (data) => {
  useAmFmStore.setState(() => data)
})

socket.on('climateFullUpdate', (data) => {
  useClimateStore.setState(() => data)
})

socket.on('reverse', (data) => {
  useCarplayStore.setState(() => ({ reverse: data }))
})
