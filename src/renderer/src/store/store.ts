import { create } from 'zustand'
import { ExtraConfig, ParkingSensors } from '../../../main/Globals'
import { io } from 'socket.io-client'
import { messages } from 'socketmost'

import { produce } from 'immer'
import _ from 'lodash'
import { UsbSettings } from 'socketmost'
import {
  DeckEvent,
  DeckStatus,
  MediaEvent,
  Random,
  Repeat,
  TunerTypes
} from '../../../main/newPiMost/types'
import { PresetList } from '../../../main/PiMostFunctions/AmFm/AmFmTunerTypes'
import { persist } from 'zustand/middleware'

export interface MostSettings {
  usb: boolean
  manualIp: boolean
  ip: string
  usbSettings: UsbSettings
  saveSettings: (settings: UsbSettings) => void
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

type DiskInfo = {
  title: number | null
  type: number | null
  fileSystem: number | null
  firstTrack: number | null
  lastTrack: number | null
  totalPlayTime: number | null
}

interface AudioDiskPlayer {
  deckStatus: DeckStatus | null
  diskTime: number | null
  trackTime: number | null
  titleTime: number | null
  trackPosition: number | null
  activeDisk: number | null
  disk1: DiskInfo | null
  disk2: DiskInfo | null
  disk3: DiskInfo | null
  disk4: DiskInfo | null
  disk5: DiskInfo | null
  disk6: DiskInfo | null
  trackTitle: string | null
  audioTime: number | null
  trackNo: number | null
  deckEvent: DeckEvent | null
  mediaEvent: MediaEvent | null
  random: Random | null
  repeat: Repeat | null
  title: string | null
  type: number | null
  fileSystem: number | null
  firstTrack: number | null
  lastTrack: number | null
  totalPlayTime: number | null
  nextTrack: () => void
  prevTrack: () => void
  play: () => void
  pause: () => void
  setRepeat: (repeatType: Repeat) => void
  setRandom: (randomType: Random) => void
  setActiveDisk: (disk: number) => void
}

type AudioControlStore = {
  currentSource: string
  setSource: (source) => void
}

type RadioPreset = {
  stationName: string
  frequency: number
}

type RadioPresetBank = Record<number, RadioPreset>

interface AmFmTunerStore {
  // currentPreset: number
  // frequency: number
  // presetList?: PresetList
  // chosenPreset: 0
  // currentStation: string
  // autoStore: boolean
  // getPresets: () => void
  // startAutoStore: () => void
  // setPresetGroup: (prevPreset: number, PresetGroupType: string) => void
  // changeStation: (preset: number, station: number) => void
  // saveStation: (preset: number, station: number) => void
  radioText: null | string
  nowPlaying: null | string
  frequency: null | number
  preset: null | number
  selectedBank: keyof typeof TunerTypes
  seekForward: () => void
  seekBack: () => void
  setTunerType: (type: keyof typeof TunerTypes) => void
  selectPreset: (bank: keyof typeof TunerTypes, preset: number) => void
  savePreset: (bank: keyof typeof TunerTypes, preset: number) => void
  autostore: () => void
  getPresets: () => void
  fm1: RadioPresetBank
  fm2: RadioPresetBank
  am: RadioPresetBank
  fma: RadioPresetBank
}

interface Volume {
  audioVolume: number | null
  parkingVolumeFront: number | null
  parkingVolumeRear: number | null
  navigationVolume: number | null
  phoneVolume: number | null
}

interface HMIStore {
  screensaver: boolean
}

interface persistentStore {
  currentSource: null | string
  setLastAudioSource: (lastAudioSource) => void
}

export const useAmFmTunerStore = create<AmFmTunerStore>()((set) => ({
  frequency: null,
  radioText: null,
  nowPlaying: null,
  preset: null,
  fm1: {},
  fm2: {},
  am: {},
  fma: {},
  selectedBank: 'fm1',
  seekForward: () => {
    socket.emit('button', { device: 'amFmTuner', function: 'seekForward' })
  },
  seekBack: () => {
    socket.emit('button', { device: 'amFmTuner', function: 'seekBack' })
  },
  setTunerType: (type: keyof typeof TunerTypes) => {
    set(() => ({ selectedBank: type }))
    socket.emit('button', { device: 'amFmTuner', function: 'setTunerType', args: { type: type } })
  },
  selectPreset: (bank, preset) => {
    socket.emit('button', {
      device: 'amFmTuner',
      function: 'selectPreset',
      args: { bank, preset }
    })
  },
  savePreset: (bank, preset) => {
    socket.emit('button', {
      device: 'amFmTuner',
      function: 'savePreset',
      args: { bank, preset }
    })
  },
  autostore: () => {
    socket.emit('button', { device: 'amFmTuner', function: 'autostore' })
  },
  getPresets: () => {
    socket.emit('button', { device: 'amFmTuner', function: 'getPresets' })
  }
}))

export const useHMIStore = create<HMIStore>()(() => ({
  screensaver: true
}))

export const useMostSettings = create<MostSettings>()((set) => ({
  usb: false,
  manualIp: false,
  ip: '',
  usbSettings: {
    version: '',
    standalone: false,
    autoShutdown: false,
    customShutdown: false,
    auxPower: false,
    forty8Khz: false,
    spare3: false,
    spare4: false,
    spare5: false,
    nodeAddressHigh: 0,
    nodeAddressLow: 0,
    groupAddress: 0,
    shutdownTimeDelay: 0,
    startupTimeDelay: 0,
    customShutdownMessage: {
      fblockId: 0,
      fktId: 0,
      optype: 0,
      data: []
    },
    amplifier: {
      fblockId: 0,
      targetAddressHigh: 0,
      targetAddressLow: 0,
      instanceId: 0,
      sinkNumber: 0
    }
  },
  saveSettings: (settings: UsbSettings) => {
    console.log('saving settings in store', settings)
    socket.emit('saveSettings', settings)
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

//
// export const useAmFmStore = create<AmFmTuner>()((_set) => ({
//   currentPreset: 0,
//   frequency: 90000,
//   currentStation: '',
//   chosenPreset: 0,
//   autoStore: false,
//   getPresets: () => {
//     console.log('getting presets')
//     socket.emit('action', GET_PRESETS)
//   },
//   startAutoStore: () => {
//     socket.emit('action', AUTO_STORE)
//   },
//   setPresetGroup: (prevPreset, preset) => {
//     console.log('setting preset', preset)
//     socket.emit('action', SET_PRESET_GROUP1(prevPreset))
//     socket.emit('action', SET_PRESET_GROUP(prevPreset, preset))
//   },
//   changeStation: (preset: number, station: number) => {
//     socket.emit('action', CHANGE_STATION(preset, station))
//   },
//   saveStation: (preset: number, station: number) => {
//     socket.emit('action', SAVE_STATION(preset, station))
//   },
//   seekForward: () => {
//     socket.emit('button', { device: 'amFmTuner', function: 'seekForward' })
//   },
//   seekBack: () => {
//     socket.emit('action', SEEK_BACK)
//   }
// }))

export const useVolumeStore = create<Volume>()(() => ({
  audioVolume: null,
  parkingVolumeFront: null,
  parkingVolumeRear: null,
  navigationVolume: null,
  phoneVolume: null
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

export const useAudioControlStore = create<AudioControlStore>()(() => ({
  currentSource: null,
  setSource: (source) => {
    console.log('setting audio source', source)
    socket.emit('setSource', source)
  }
}))

export const useAudioDiskPlayer = create<AudioDiskPlayer>()(() => ({
  deckStatus: null,
  diskTime: null,
  trackTime: null,
  titleTime: null,
  trackPosition: null,
  activeDisk: null,
  disk1: null,
  disk2: null,
  disk3: null,
  disk4: null,
  disk5: null,
  disk6: null,
  trackTitle: null,
  audioTime: null,
  trackNo: null,
  deckEvent: null,
  mediaEvent: null,
  random: null,
  repeat: null,
  title: null,
  type: null,
  fileSystem: null,
  firstTrack: null,
  lastTrack: null,
  totalPlayTime: null,
  nextTrack: () => {
    socket.emit('button', { device: 'audioDiskPlayer', function: 'nextTrack' })
  },
  prevTrack: () => {
    socket.emit('button', { device: 'audioDiskPlayer', function: 'prevTrack' })
  },
  play: () => {
    socket.emit('button', { device: 'audioDiskPlayer', function: 'play' })
  },
  pause: () => {
    socket.emit('button', { device: 'audioDiskPlayer', function: 'pause' })
  },
  setRandom: (randomType: Random) => {
    socket.emit('button', {
      device: 'audioDiskPlayer',
      function: 'random',
      args: { randomType: randomType }
    })
  },
  setRepeat: (repeatType: Repeat) => {
    socket.emit('button', {
      device: 'audioDiskPlayer',
      function: 'repeat',
      args: { repeatType: repeatType }
    })
  },
  setActiveDisk: (disk) => {
    console.log('active disk')
    socket.emit('button', {
      device: 'audioDiskPlayer',
      function: 'activeDisk',
      args: { disk: disk }
    })
  }
}))

export const usePersistantStore = create<persistentStore>()(
  persist(
    (set, get) => ({
      lastAudioSource: 'AudioDiskPlayer',
      setLastAudioSource: (audioSource) => set({ lastAudioSource: audioSource })
    }),
    {
      name: 'persistent-storage'
    }
  )
)

const URL = 'http://localhost:4000'
const socket = io(URL)

socket.on('settings', (settings: ExtraConfig) => {
  console.log('received settings', settings)
  useCarplayStore.setState(() => ({ settings: settings }))
})

socket.on('AudioDiskPlayer', (data) => {
  console.log(data)
  useAudioDiskPlayer.setState((state) => {
    return produce(state, (draft) => {
      _.merge(draft, data)
    })
  })
})

socket.on('AmFmTuner', (data) => {
  console.log('🔥 AMFM SOCKET DATA:', data)

  useAmFmTunerStore.setState((state) => {
    return produce(state, (draft) => {
      _.merge(draft, data)
    })
  })

  console.log('🔥 AMFM ZUSTAND AFTER:', useAmFmTunerStore.getState())
})

socket.on('AudioControl', (data) => {
  console.log(data)
  useAudioControlStore.setState((state) => {
    return produce(state, (draft) => {
      _.merge(draft, data)
    })
  })
  if ('currentSource' in data) {
    usePersistantStore.setState((state) => {
      return produce(state, (draft) => {
        _.merge(draft, data)
      })
    })
  }
  if ('audioVolume' in data) {
    useVolumeStore.setState((state) => {
      return produce(state, (draft) => {
        _.merge(draft, data)
      })
    })
  }
})

socket.on('audioDiskPlayerFullUpdate', (data) => {
  useAudioDiskPlayer.setState(() => data)
})

socket.on('reverse', (data) => {
  useCarplayStore.setState(() => ({ reverse: data }))
})

socket.on('usbSettings', (data) => {
  console.log('settings in store')
  useMostSettings.setState(() => ({ usbSettings: data }))
  console.log(useMostSettings.getState())
})

socket.on('HMI', (data) => {
  useHMIStore.setState((state) => {
    return produce(state, (draft) => {
      _.merge(draft, data)
    })
  })
})
