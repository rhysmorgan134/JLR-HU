import { create } from 'zustand'
import { ExtraConfig, ParkingSensors } from '../../../main/Globals'
import { io } from 'socket.io-client'
import { messages } from 'socketmost'
import type { KeyCommand } from '../components/worker/types'

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

export interface MostSettings {
  usb: boolean
  manualIp: boolean
  ip: string
  usbSettings: UsbSettings
  saveSettings: (settings: UsbSettings) => void
  requestSettings: () => void
  bootToDfu: () => void
}

interface CarplayStore {
  settings: null | ExtraConfig
  saveSettings: (settings: ExtraConfig) => void
  plugged: boolean
  setPlugged: (plugged: boolean) => void
  mediaSongName: string | null
  mediaAlbumName: string | null
  mediaArtistName: string | null
  mediaAppName: string | null
  mediaAlbumCover: string | null
  setMedia: (
    media: Partial<
      Pick<
        CarplayStore,
        | 'mediaSongName'
        | 'mediaAlbumName'
        | 'mediaArtistName'
        | 'mediaAppName'
        | 'mediaAlbumCover'
      >
    >
  ) => void
  clearMedia: () => void
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
  keyCommand: KeyCommand | ''
  commandCounter: number
}

interface HMICommandStore {
  path: string | null
  action: 'navigate' | 'homeToggle' | 'powerToggle' | null
  nonce: number
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
  currentSource: string | null
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

export type DabRecord = {
  index: number
  name: string
  data: number[]
  ensembleId?: number[]
  serviceId?: number[]
  preset?: number
}

interface DabTunerStore {
  scanning: boolean
  scanProgress: number | null
  scanError: number[] | null
  radioText: string
  frequencyTable: number | null
  ensembles: Record<string, DabRecord>
  services: Record<string, DabRecord>
  presets: Record<string, DabRecord & { bank?: number; preset?: number }>
  serviceWindowOffset: number
  ensembleWindowOffset: number
  currentAudioService?: { opType: number; data: number[] }
  currentAudioComponent?: { opType: number; data: number[] }
  tunerStatus?: { opType: number; data: number[] }
  selectedPreset?: number
  selectedService?: string | null
  fmTraffic?: boolean
  selectPreset: (preset: number) => void
  selectService: (service: DabRecord) => void
  requestFullServiceList: () => void
  requestEnsembleList: () => void
  requestEnsembleServices: (ensembleId: number[]) => void
  requestPtyServices: (pty: number) => void
  moveServiceWindow: (direction: 'top' | 'bottom' | 'up' | 'down', steps?: number) => void
  moveEnsembleWindow: (direction: 'top' | 'bottom' | 'up' | 'down', steps?: number) => void
  startAutoTune: () => void
  cancelAutoTune: () => void
  setAnnouncement: (type: number, enabled: boolean) => void
  setFmTraffic: (enabled: boolean) => void
  setCountry: (table: number) => void
}

interface Volume {
  audioVolume: number | null
  parkingVolumeFront: number | null
  parkingVolumeRear: number | null
  voiceVolume: number | null
  navigationVolume: number | null
  phoneVolume: number | null
  setParkingVolume: (value: number) => void
  setVoiceVolume: (value: number) => void
  setNavigationVolume: (value: number) => void
  setPhoneVolume: (value: number) => void
}

interface HMIStore {
  screensaver: boolean
}

interface AmplifierStore {
  balance: number
  loudness: boolean
  bass: number
  treble: number
  fader: number
  subwoofer: number
  centre: number
  mode: number
  surround: number
  avc: number
  source: number | null
  mixerLevel: number[]
  setBalance: (value: number) => void
  setLoudness: (enabled: boolean) => void
  setBass: (value: number) => void
  setTreble: (value: number) => void
  setFader: (value: number) => void
  setSubwoofer: (value: number) => void
  setCentre: (value: number) => void
  setMode: (value: number) => void
  setSurround: (value: number) => void
  setAvc: (value: number) => void
}

interface CanGatewayStore {
  hours: number | null
  minutes: number | null
  autoLock: boolean
  driveAwayLocking: number
  globalWindowClose: boolean
  globalWindowOpen: boolean
  ambientLight: number
  lights: boolean
  mirrorFoldBack: boolean
  mirrorDip: boolean
  passiveArming: boolean
  alarmSensors: boolean
  twoStageLocking: boolean
  externalTemp: number | null
  avgMpg: number | null
  range: number | null
  distance: number | null
  avgSpeed: number | null
  currentSpeed: number | null
  tripMode: 1 | 2 | 3 | null
  distanceUnit: 'miles' | 'kilometres' | null
  temperatureUnit: 'fahrenheit' | 'celsius' | null
  mostCcf: {
    captured: boolean
    profile: string
    raw302: string | null
    raw303: string | null
    properties: Record<string, number>
    audioSystem: string
    centreSpeaker: string
    subwoofer: boolean | null
    rearHeadphones: boolean | null
    auxInput: boolean | null
    audioPlayer: string
    digitalRadio: string
    microphone: boolean | null
    navigation: string
    voiceControl: string
    steeringWheelAudioButtons: boolean | null
  }
  setAutoLock: (enabled: boolean) => void
  setDriveAway: (speed: number) => void
  setPassiveArming: (enabled: boolean) => void
  setTwoStageLocking: (enabled: boolean) => void
  setAlarmSensors: (enabled: boolean) => void
  setGlobalWindowsOpen: (enabled: boolean) => void
  setGlobalWindowsClose: (enabled: boolean) => void
  setMirrorFoldBack: (enabled: boolean) => void
  setMirrorDip: (enabled: boolean) => void
  setTripMode: (mode: 1 | 2 | 3) => void
  addTrip: () => void
  setDistanceUnit: (unit: 'miles' | 'kilometres') => void
  setTemperatureUnit: (unit: 'fahrenheit' | 'celsius') => void
  sendInstrumentClusterText: (text?: string) => void
}

interface ParkingAssistStore {
  parkingSensors: ParkingSensors
  parkingActive: boolean
  manualOpen: boolean
  setManualOpen: (open: boolean) => void
}

type SeatTemp = -3 | -2 | -1 | 0 | 1 | 2 | 3

interface ClimateStore {
  leftTemp: number | null
  rightTemp: number | null
  fanSpeed: number
  recirc: boolean
  fanAuto: boolean
  maxDefrost: boolean
  auto: boolean
  ac: boolean
  face: boolean
  feet: boolean
  windscreen: boolean
  leftSeat: SeatTemp
  rightSeat: SeatTemp
  setAuto: () => void
  setSync: () => void
  setAC: (active: boolean) => void
  setFace: (active: boolean) => void
  setFeet: (active: boolean) => void
  setWindscreen: (active: boolean) => void
  setLeftSeat: (temperature: SeatTemp) => void
  setRightSeat: (temperature: SeatTemp) => void
}

interface NetworkMasterStore {
  networkStatus: number | null
  configurationState: string
}

export interface SystemInfoState {
  platformName: string
  release: string
  architecture: string
  hostname: string
  locale: string
  timeZone: string
  uses24HourClock: boolean
  networkConnected: boolean
  internetConnected: boolean
  ipAddresses: string[]
  uptimeSeconds: number
  totalMemory: number
  freeMemory: number
  cpuModel: string
  cpuCount: number
  cpuTemperature: number | null
  appVersion: string
  checkedAt: string | null
  refresh: () => void
}

interface persistentStore {
  currentSource: null | string
  setLastAudioSource: (lastAudioSource) => void
}

export type MostDiagnosticDevice = {
  address: number
  fBlockID: number
  instanceID: number
}

export type MostDiagnosticMessage = {
  direction: 'rx' | 'tx'
  timestamp: number
  sourceAddress?: number
  targetAddress?: number
  fBlockID: number
  instanceID: number
  fktID: number
  opType: number
  telID?: number
  telLen?: number
  data: number[]
}

export type MostSubscription = MostDiagnosticDevice & {
  owner: string
  state: 'queued' | 'active' | 'failed' | 'in-progress'
  functions: number[]
  all: boolean
}

interface MostDiagnosticsStore {
  messages: MostDiagnosticMessage[]
  registry: MostDiagnosticDevice[]
  selectedDevice: MostDiagnosticDevice | null
  subscriptions: MostSubscription[]
  functions: number[]
  paused: boolean
  logging: boolean
  logPath: string | null
  requestRegistry: () => void
  selectDevice: (device: MostDiagnosticDevice) => void
  subscribeAll: () => void
  requestFunctions: () => void
  subscribeFunctions: (functions: number[]) => void
  sendMessage: (message: Omit<MostDiagnosticMessage, 'direction' | 'timestamp' | 'sourceAddress'> & { targetAddress: number }) => void
  clearMessages: () => void
  setPaused: (paused: boolean) => void
  setLogging: (enabled: boolean) => void
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

export const useNetworkMasterStore = create<NetworkMasterStore>()(() => ({
  networkStatus: null,
  configurationState: 'unknown'
}))

export const useSystemInfoStore = create<SystemInfoState>()(() => ({
  platformName: 'Unknown',
  release: '',
  architecture: '',
  hostname: '',
  locale: '',
  timeZone: '',
  uses24HourClock: true,
  networkConnected: false,
  internetConnected: false,
  ipAddresses: [],
  uptimeSeconds: 0,
  totalMemory: 0,
  freeMemory: 0,
  cpuModel: '',
  cpuCount: 0,
  cpuTemperature: null,
  appVersion: '',
  checkedAt: null,
  refresh: () => socket.emit('systemInfo:get')
}))

export const useParkingAssistStore = create<ParkingAssistStore>()((set) => ({
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
  parkingActive: false,
  manualOpen: false,
  setManualOpen: (manualOpen) => set({ manualOpen })
}))

export const useAmplifierStore = create<AmplifierStore>()((set, get) => ({
  balance: 0,
  loudness: false,
  bass: 0,
  treble: 0,
  fader: 0,
  subwoofer: 0,
  centre: 0,
  mode: 0,
  surround: 0,
  avc: 1,
  source: null,
  mixerLevel: [],
  setBalance: (value) => {
    set({ balance: value })
    socket.emit('button', { device: 'amplifier', function: 'setBalance', args: { value } })
  },
  setLoudness: (enabled) => {
    set({ loudness: enabled })
    socket.emit('button', { device: 'amplifier', function: 'setLoudness', args: { enabled } })
  },
  setBass: (value) => {
    set({ bass: value })
    socket.emit('button', { device: 'amplifier', function: 'setBass', args: { value } })
  },
  setTreble: (value) => {
    set({ treble: value })
    socket.emit('button', { device: 'amplifier', function: 'setTreble', args: { value } })
  },
  setFader: (value) => {
    set({ fader: value })
    socket.emit('button', { device: 'amplifier', function: 'setFader', args: { value } })
  },
  setSubwoofer: (value) => {
    set({ subwoofer: value })
    socket.emit('button', { device: 'amplifier', function: 'setSubwoofer', args: { value } })
  },
  setCentre: (value) => {
    set({ centre: value })
    socket.emit('button', {
      device: 'amplifier',
      function: 'setCentre',
      args: { mode: get().mode, value }
    })
  },
  setMode: (value) => {
    set({ mode: value })
    socket.emit('button', { device: 'amplifier', function: 'setMode', args: { value } })
  },
  setSurround: (value) => {
    set({ surround: value })
    socket.emit('button', { device: 'amplifier', function: 'setSurround', args: { value } })
  },
  setAvc: (value) => {
    socket.emit('button', { device: 'amplifier', function: 'setAvc', args: { value } })
  }
}))

export const useCanGatewayStore = create<CanGatewayStore>()((set, get) => ({
  hours: null,
  minutes: null,
  autoLock: false,
  driveAwayLocking: 0,
  globalWindowClose: false,
  globalWindowOpen: false,
  ambientLight: 0,
  lights: false,
  mirrorFoldBack: false,
  mirrorDip: false,
  passiveArming: false,
  alarmSensors: false,
  twoStageLocking: false,
  externalTemp: null,
  avgMpg: null,
  range: null,
  distance: null,
  avgSpeed: null,
  currentSpeed: null,
  tripMode: null,
  distanceUnit: null,
  temperatureUnit: null,
  mostCcf: {
    captured: false,
    profile: 'Waiting for CCF',
    raw302: null,
    raw303: null,
    properties: {},
    audioSystem: 'Unknown',
    centreSpeaker: 'Unknown',
    subwoofer: null,
    rearHeadphones: null,
    auxInput: null,
    audioPlayer: 'Unknown',
    digitalRadio: 'Unknown',
    microphone: null,
    navigation: 'Unknown',
    voiceControl: 'Unknown',
    steeringWheelAudioButtons: null
  },
  setAutoLock: (enabled) => {
    set({ autoLock: enabled })
    socket.emit('button', { device: 'canGateway', function: 'setAutoLock', args: { enabled } })
  },
  setDriveAway: (speed) => {
    set({ driveAwayLocking: speed })
    socket.emit('button', { device: 'canGateway', function: 'setDriveAway', args: { speed } })
  },
  setPassiveArming: (enabled) => {
    set({ passiveArming: enabled })
    socket.emit('button', { device: 'canGateway', function: 'setPassiveArming', args: { enabled } })
  },
  setTwoStageLocking: (enabled) => {
    set({ twoStageLocking: enabled })
    socket.emit('button', { device: 'canGateway', function: 'setTwoStageLocking', args: { enabled } })
  },
  setAlarmSensors: (enabled) => {
    set({ alarmSensors: enabled })
    socket.emit('button', { device: 'canGateway', function: 'setAlarmSensors', args: { enabled } })
  },
  setGlobalWindowsOpen: (enabled) => {
    set({ globalWindowOpen: enabled })
    socket.emit('button', {
      device: 'canGateway',
      function: 'setGlobalWindows',
      args: { open: enabled, close: get().globalWindowClose }
    })
  },
  setGlobalWindowsClose: (enabled) => {
    set({ globalWindowClose: enabled })
    socket.emit('button', {
      device: 'canGateway',
      function: 'setGlobalWindows',
      args: { open: get().globalWindowOpen, close: enabled }
    })
  },
  setMirrorFoldBack: (enabled) => {
    set({ mirrorFoldBack: enabled })
    socket.emit('button', {
      device: 'canGateway',
      function: 'setMirrors',
      args: { foldBack: enabled, dip: get().mirrorDip }
    })
  },
  setMirrorDip: (enabled) => {
    set({ mirrorDip: enabled })
    socket.emit('button', {
      device: 'canGateway',
      function: 'setMirrors',
      args: { foldBack: get().mirrorFoldBack, dip: enabled }
    })
  },
  setTripMode: (mode) => {
    socket.emit('button', { device: 'canGateway', function: 'setTripMode', args: { mode } })
  },
  addTrip: () => socket.emit('button', { device: 'canGateway', function: 'addTrip' }),
  setDistanceUnit: (unit) =>
    socket.emit('button', { device: 'canGateway', function: 'setDistanceUnit', args: { unit } }),
  setTemperatureUnit: (unit) =>
    socket.emit('button', { device: 'canGateway', function: 'setTemperatureUnit', args: { unit } }),
  sendInstrumentClusterText: (text = 'Hello World') =>
    socket.emit('button', {
      device: 'canGateway',
      function: 'sendInstrumentClusterText',
      args: { text }
    })
}))

export const useClimateStore = create<ClimateStore>()(() => ({
  leftTemp: null,
  rightTemp: null,
  fanSpeed: 0,
  recirc: false,
  fanAuto: false,
  maxDefrost: false,
  auto: false,
  ac: false,
  face: false,
  feet: false,
  windscreen: false,
  leftSeat: 0,
  rightSeat: 0,
  setAuto: () => socket.emit('button', { device: 'climate', function: 'setAuto' }),
  setSync: () => socket.emit('button', { device: 'climate', function: 'setSync' }),
  setAC: (active) =>
    socket.emit('button', { device: 'climate', function: 'setAC', args: { active } }),
  setFace: (active) =>
    socket.emit('button', { device: 'climate', function: 'setFace', args: { active } }),
  setFeet: (active) =>
    socket.emit('button', { device: 'climate', function: 'setFeet', args: { active } }),
  setWindscreen: (active) =>
    socket.emit('button', { device: 'climate', function: 'setWindscreen', args: { active } }),
  setLeftSeat: (temperature) =>
    socket.emit('button', {
      device: 'climate',
      function: 'setSeat',
      args: { side: 1, temperature }
    }),
  setRightSeat: (temperature) =>
    socket.emit('button', {
      device: 'climate',
      function: 'setSeat',
      args: { side: 2, temperature }
    })
}))

export const useMostSettings = create<MostSettings>()(() => ({
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
    debug: false,
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
    },
    microphone: {
      fblockId: 0,
      targetAddressHigh: 0,
      targetAddressLow: 0,
      instanceId: 0,
      sinkNumber: 0
    }
  },
  saveSettings: (settings: UsbSettings) => {
    console.log('saving settings in store', settings)
    socket.emit('mostUsb:saveSettings', settings)
  },
  requestSettings: () => socket.emit('mostUsb:getSettings'),
  bootToDfu: () => socket.emit('piMostFirmware:bootToDfu')
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
  plugged: false,
  setPlugged: (plugged) => set({ plugged }),
  mediaSongName: null,
  mediaAlbumName: null,
  mediaArtistName: null,
  mediaAppName: null,
  mediaAlbumCover: null,
  setMedia: (media) => set(media),
  clearMedia: () =>
    set({
      mediaSongName: null,
      mediaAlbumName: null,
      mediaArtistName: null,
      mediaAppName: null,
      mediaAlbumCover: null
    }),
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
  },
  keyCommand: '',
  commandCounter: 0
}))

export const useHMICommandStore = create<HMICommandStore>()(() => ({
  path: null,
  action: null,
  nonce: 0
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
  voiceVolume: null,
  navigationVolume: null,
  phoneVolume: null,
  setParkingVolume: (value) =>
    socket.emit('button', { device: 'audioControl', function: 'setParkingVolume', args: { value } }),
  setVoiceVolume: (value) =>
    socket.emit('button', { device: 'audioControl', function: 'setVoiceVolume', args: { value } }),
  setNavigationVolume: (value) =>
    socket.emit('button', { device: 'audioControl', function: 'setNavigationVolume', args: { value } }),
  setPhoneVolume: (value) =>
    socket.emit('button', { device: 'audioControl', function: 'setPhoneVolume', args: { value } })
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

export const useDabTunerStore = create<DabTunerStore>()(() => ({
  scanning: false,
  scanProgress: null,
  scanError: null,
  radioText: '',
  frequencyTable: null,
  ensembles: {},
  services: {},
  presets: {},
  serviceWindowOffset: 0,
  ensembleWindowOffset: 0,
  selectPreset: (preset) => socket.emit('button', { device: 'dabTuner', function: 'selectPreset', args: { preset } }),
  selectService: (service) => {
    if (!service.serviceId || !service.ensembleId) return
    socket.emit('button', { device: 'dabTuner', function: 'selectService', args: { serviceId: service.serviceId, ensembleId: service.ensembleId, name: service.name } })
  },
  requestFullServiceList: () => socket.emit('button', { device: 'dabTuner', function: 'requestFullServiceList' }),
  requestEnsembleList: () => socket.emit('button', { device: 'dabTuner', function: 'requestEnsembleList' }),
  requestEnsembleServices: (ensembleId) => socket.emit('button', { device: 'dabTuner', function: 'requestEnsembleServices', args: { ensembleId } }),
  requestPtyServices: (pty) => socket.emit('button', { device: 'dabTuner', function: 'requestPtyServices', args: { pty } }),
  moveServiceWindow: (direction, steps = 5) => socket.emit('button', { device: 'dabTuner', function: 'moveServiceWindow', args: { direction, steps } }),
  moveEnsembleWindow: (direction, steps = 5) => socket.emit('button', { device: 'dabTuner', function: 'moveEnsembleWindow', args: { direction, steps } }),
  startAutoTune: () => socket.emit('button', { device: 'dabTuner', function: 'startAutoTune' }),
  cancelAutoTune: () => socket.emit('button', { device: 'dabTuner', function: 'cancelAutoTune' }),
  setAnnouncement: (type, enabled) => socket.emit('button', { device: 'dabTuner', function: 'setAnnouncement', args: { type, enabled } }),
  setFmTraffic: (enabled) => socket.emit('button', { device: 'dabTuner', function: 'setFmTraffic', args: { enabled } }),
  setCountry: (table) => socket.emit('button', { device: 'dabTuner', function: 'setCountry', args: { table } })
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

export const usePersistantStore = create<persistentStore>()((set) => ({
  currentSource: window.localStorage.getItem('last-audio-source') || 'AudioDiskPlayer',
  setLastAudioSource: (audioSource) => {
    if (audioSource) window.localStorage.setItem('last-audio-source', audioSource)
    else window.localStorage.removeItem('last-audio-source')
    set({ currentSource: audioSource })
  }
}))

export const useMostDiagnosticsStore = create<MostDiagnosticsStore>()((set, get) => ({
  messages: [],
  registry: [],
  selectedDevice: null,
  subscriptions: [],
  functions: [],
  paused: false,
  logging: false,
  logPath: null,
  requestRegistry: () => socket.emit('mostDiagnostics:requestRegistry'),
  selectDevice: (selectedDevice) => set({ selectedDevice, functions: [] }),
  subscribeAll: () => {
    const device = get().selectedDevice
    if (device) socket.emit('mostDiagnostics:subscribe', device)
  },
  requestFunctions: () => {
    const device = get().selectedDevice
    if (device) socket.emit('mostDiagnostics:requestFunctions', device)
  },
  subscribeFunctions: (functions) => {
    const device = get().selectedDevice
    if (device && functions.length) socket.emit('mostDiagnostics:subscribeFunctions', { device, functions })
  },
  sendMessage: (message) => socket.emit('mostDiagnostics:send', {
    targetAddressHigh: (message.targetAddress >> 8) & 0xff,
    targetAddressLow: message.targetAddress & 0xff,
    fBlockID: message.fBlockID,
    instanceID: message.instanceID,
    fktID: message.fktID,
    opType: message.opType,
    data: message.data
  }),
  clearMessages: () => set({ messages: [] }),
  setPaused: (paused) => set({ paused }),
  setLogging: (enabled) => socket.emit('mostDiagnostics:setLogging', enabled)
}))

const URL = 'http://localhost:4000'
export const socket = io(URL)

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

socket.on('DabTuner', (data) => {
  useDabTunerStore.setState((state) =>
    produce(state, (draft) => {
      _.merge(draft, data)
    })
  )
})

socket.on('AudioControl', (data) => {
  console.log(data)
  useAudioControlStore.setState((state) => {
    return produce(state, (draft) => {
      _.merge(draft, data)
    })
  })
  if ('currentSource' in data) {
    usePersistantStore.getState().setLastAudioSource(data.currentSource)
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

socket.on('systemInfo', (data) => {
  useSystemInfoStore.setState((state) => ({ ...state, ...data }))
})

let parkingSensorTimeout: ReturnType<typeof setTimeout> | undefined
socket.on('CanGateway', (data) => {
  useCanGatewayStore.setState((state) => ({ ...state, ...data }))
  if (data?.parkingSensors) {
    useParkingAssistStore.setState((state) => ({
      parkingSensors: { ...state.parkingSensors, ...data.parkingSensors },
      parkingActive: true
    }))
    if (parkingSensorTimeout) clearTimeout(parkingSensorTimeout)
    parkingSensorTimeout = setTimeout(() => {
      useParkingAssistStore.setState({ parkingActive: false })
    }, 1200)
  }
})

socket.on('Amplifier', (data) => {
  useAmplifierStore.setState((state) => ({ ...state, ...data }))
})

socket.on('Climate', (data) => {
  useClimateStore.setState((state) =>
    produce(state, (draft) => {
      _.merge(draft, data)
    })
  )
})

socket.on('NetworkMaster', (data) => {
  useNetworkMasterStore.setState((state) => ({ ...state, ...data }))
})

const pendingMostMessages: MostDiagnosticMessage[] = []
let mostFlushTimer: ReturnType<typeof setTimeout> | null = null
socket.on('mostDiagnostics:message', (message: MostDiagnosticMessage) => {
  if (useMostDiagnosticsStore.getState().paused) return
  pendingMostMessages.push(message)
  if (!mostFlushTimer) mostFlushTimer = setTimeout(() => {
    mostFlushTimer = null
    const batch = pendingMostMessages.splice(0)
    useMostDiagnosticsStore.setState((state) => ({ messages: [...state.messages, ...batch].slice(-2500) }))
  }, 100)
})

socket.on('mostDiagnostics:registry', (registry: MostDiagnosticDevice[]) => {
  useMostDiagnosticsStore.setState({ registry })
})

socket.on('mostDiagnostics:subscriptions', (subscriptions: MostSubscription[]) => {
  useMostDiagnosticsStore.setState({ subscriptions })
})

socket.on('mostDiagnostics:functions', ({ functions }: { functions: number[] }) => {
  useMostDiagnosticsStore.setState({ functions })
})

socket.on('mostDiagnostics:logging', ({ enabled, path }: { enabled: boolean; path: string | null }) => {
  useMostDiagnosticsStore.setState({ logging: enabled, logPath: path })
})

socket.on('HMICommand', (command: {
  type: 'navigate' | 'carplay' | 'homeToggle' | 'powerToggle'
  path?: string
  command?: KeyCommand
}) => {
  if (command.type === 'navigate' && command.path) {
    useHMICommandStore.setState((state) => ({
      path: command.path!,
      action: 'navigate',
      nonce: state.nonce + 1
    }))
  } else if (command.type === 'carplay' && command.command) {
    useCarplayStore.setState((state) => ({ keyCommand: command.command!, commandCounter: state.commandCounter + 1 }))
  } else if (command.type === 'homeToggle' || command.type === 'powerToggle') {
    useHMICommandStore.setState((state) => ({
      path: null,
      action: command.type,
      nonce: state.nonce + 1
    }))
  }
})

socket.on('connect', () => socket.emit('mostDiagnostics:getSubscriptions'))
