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
import {
  AC,
  AUTO,
  FACE,
  FEET,
  LEFT_SEAT_TEMP,
  RIGHT_SEAT_TEMP,
  SeatTemp,
  SYNC,
  WINDSCREEN
} from '../../../main/PiMostFunctions/Climate/ClimateTypes'
import {
  ALARM_SENSORS,
  AUTO_RELOCK,
  CanGatewayStatus,
  DRIVE_AWAY_LOCKING,
  DriveAwayLocking,
  GLOBAL_WINDOWS_CLOSE,
  GLOBAL_WINDOWS_OPEN,
  MIRROR_DIP,
  MIRROR_FOLDBACK,
  PASSIVE_ARMING,
  TWO_STAGE_UNLOCKING
} from '../../../main/PiMostFunctions/CanGateway/CanGatewayTypes'

interface CanGatewayStore {
  newSwitch: (source: string) => void
  carplaySwitch: () => void
  setDriveAway: (speed: DriveAwayLocking) => void
  setTwoStageUnlocking: (enabled: boolean) => void
  setPassiveArming: (enabled: boolean) => void
  setAutoLock: (enabled: boolean) => void
  setAlarmSensors: (enabled: boolean) => void
  setGlobalWindowsOpen: (enabled: boolean) => void
  setGlobalWindowsClose: (enabled: boolean) => void
  setMirrorFoldBack: (enabled: boolean) => void
  setMirrorDip: (enabled: boolean) => void
}

interface CarplayStore {
  settings: null | ExtraConfig
  saveSettings: (settings: ExtraConfig) => void
  playing: boolean
  getSettings: () => void
  stream: (stream: messages.Stream) => void
  showSettings: boolean
  setShowSettings: (show: boolean) => void
  reverse: boolean
  setReverse: (reverse: boolean) => void
  setPlaying: (playing: boolean) => void
  focus: boolean
  setFocus: (focus: boolean) => void
}

interface ClimateStore {
  leftTemp: number
  rightTemp: number
  recirc: boolean
  auto: boolean
  ac: boolean
  maxDefrost: boolean
  fanSpeed: number
  face: boolean
  feet: boolean
  windscreen: boolean
  setWindscreen: (active: boolean) => void
  setFace: (active: boolean) => void
  setFeet: (active: boolean) => void
  setSync: () => void
  setAuto: () => void
  setAC: (active: boolean) => void
  setRightSeat: (temperature: SeatTemp) => void
  setLeftSeat: (temperature: SeatTemp) => void
  leftSeat: number
  rightSeat: number
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

export const useCanGatewayStore = create<CanGatewayStore & CanGatewayStatus>()(() => ({
  hours: 0,
  minutes: 0,
  autoLock: false,
  driveAwayLocking: 0,
  globalWindowClose: false,
  globalWindowOpen: false,
  mirrorFoldBack: false,
  passiveArming: false,
  twoStageLocking: false,
  alarmSensors: false,
  mirrorDip: false,
  avgMpg: 0,
  range: 0,
  distance: 0,
  avgSpeed: 0,
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
  },
  carplaySwitch: () => {
    socket.emit('carplaySwitch')
  },
  setDriveAway: (speed) => {
    socket.emit('action', DRIVE_AWAY_LOCKING(speed))
  },
  setAlarmSensors: (enabled) => {
    socket.emit('action', ALARM_SENSORS(enabled))
  },
  setTwoStageUnlocking: (enabled) => {
    socket.emit('action', TWO_STAGE_UNLOCKING(enabled))
  },
  setPassiveArming: (enabled) => {
    socket.emit('action', PASSIVE_ARMING(enabled))
  },
  setAutoLock: (enabled) => {
    socket.emit('action', AUTO_RELOCK(enabled))
  },
  setGlobalWindowsOpen: (enabled) => {
    socket.emit('action', GLOBAL_WINDOWS_OPEN(enabled))
  },
  setGlobalWindowsClose: (enabled) => {
    socket.emit('action', GLOBAL_WINDOWS_CLOSE(enabled))
  },
  setMirrorFoldBack: (enabled) => {
    socket.emit('action', MIRROR_FOLDBACK(enabled))
  },
  setMirrorDip: (enabled) => {
    socket.emit('action', MIRROR_DIP(enabled))
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
  playing: false,
  setPlaying: (playing) => {
    set(() => ({ playing }))
  },
  showSettings: false,
  setShowSettings: (show) => {
    set(() => ({ showSettings: show }))
  },
  reverse: false,
  setReverse: (reverse) => {
    set(() => ({ reverse: reverse }))
  },
  focus: false,
  setFocus: (focus) => {
    set(() => ({ focus: focus }))
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
  fanSpeed: 0,
  face: false,
  feet: false,
  ac: true,
  windscreen: false,
  leftSeat: 0,
  rightSeat: 0,
  setWindscreen: (active) => {
    socket.emit('action', WINDSCREEN(active))
  },
  setFace: (active) => {
    socket.emit('action', FACE(active))
  },
  setFeet: (active) => {
    socket.emit('action', FEET(active))
  },
  setSync: () => {
    socket.emit('action', SYNC)
  },
  setAuto: () => {
    socket.emit('action', AUTO)
  },
  setAC: (active) => {
    socket.emit('action', AC(active))
  },
  setLeftSeat: (temperature: SeatTemp) => {
    socket.emit('action', LEFT_SEAT_TEMP(temperature))
  },
  setRightSeat: (temperature: SeatTemp) => {
    socket.emit('action', RIGHT_SEAT_TEMP(temperature))
  }
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
  console.log('can gateway: ', data)
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
  console.log(useClimateStore.getState())
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
