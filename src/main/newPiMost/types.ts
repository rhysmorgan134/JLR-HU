export type Device = {
  addressHigh: number
  addressLow: number
  fBlockID: number
  instanceID: number
}

export enum OpType {
  'set' = 0x0,
  'get' = 0x1,
  'setGet' = 0x2,
  'increment' = 0x3,
  'decrement' = 0x4,
  'getInterface' = 0x5,
  'startResultAck' = 0x6,
  'errorAck' = 0x9,
  'status' = 0xc,
  'interface' = 0x0e,
  'error' = 0x0f,
  'start' = 0x0,
  'abort' = 0x01,
  'startResult' = 0x02,
  'abortAck' = 0x07,
  'processingAck' = 0x0a,
  'processing' = 0x0b,
  'result' = 0x0c,
  'resultAck' = 0x0d
}

export type FBlockNotAvailable = {
  opType: OpType.error
  data: [0x01]
}

export type InstanceNotAvailabe = {
  opType: OpType.error
  data: [0x02]
}

export const FktNotAvailable = {
  opType: OpType.error,
  data: [0x03]
}

export type OpTypeNotAvailable = {
  opType: OpType.error
  data: [0x04]
}

export enum FBlockMap {
  'NetBlock' = 0x01,
  'NetworkMaster' = 0x02,
  'ConnectionMaster' = 0x03,
  'PowerMaster' = 0x04,
  'Vehicle' = 0x05,
  'Diagnosis' = 0x06,
  'Router' = 0x08,
  'DebugMessages' = 0x09,
  'Tool' = 0xe,
  'EnhancedTestability' = 0x0f,
  'HMI' = 0x10,
  'SpeechRecognition' = 0x11,
  'SpeechOutput' = 0x12,
  'SpeechDatabase' = 0x13,
  'AudioMaster' = 0x20,
  'AudioDSP' = 0x21,
  'AudioAmplifier' = 0x22,
  'HeadphoneAmplifier' = 0x23,
  'AuxInput' = 0x24,
  'AuxOutput' = 0x25,
  'MicrophoneInput' = 0x26,
  'HandsFreeProcessor' = 0x28,
  'AuxInOut' = 0x29,
  'AudioTapeRecorder' = 0x30,
  'AudioDiskPlayer' = 0x31,
  'ROMDiskPlayer' = 0x32,
  'MultimediaDiskPlayer' = 0x33,
  'DVDPlayer' = 0x34,
  'AmFmTuner' = 0x40,
  'TMCTuner' = 0x41,
  'TVTuner' = 0x42,
  'DABTuner' = 0x43,
  'SatelliteRadio' = 0x44,
  'TPEGTuner' = 0x45,
  'ESDR' = 0x46,
  'Telephone' = 0x50,
  'Phonebook' = 0x51,
  'NavigationSystem' = 0x52,
  'TMCDecoder' = 0x53,
  'Bluetooth' = 0x54,
  'Display' = 0x60,
  'Camera' = 0x61,
  'VideoTapeRecorder' = 0x62
}

export enum NetworkStatus {
  notOk,
  ok,
  invalid,
  new
}

export type networkRecord = {
  fBlockID: number
  devices: number[]
}

export enum ErrorTypes {
  'FBlockNotAvailable' = 0x01,
  'InstIDNotAvailable' = 0x02,
  'FktIDNotAvailable' = 0x03,
  'OpTypeNotAvailable' = 0x04,
  'SegmentationError' = 0x0c
}

export enum AudioDiskPlayerFunctions {
  'DeckStatus' = 0x200,
  'TimePosition' = 0x201,
  'TrackPosition' = 0x202,
  'ActiveDisk' = 0x412,
  'MediaInfo' = 0x413,
  'AudioDiskInfo' = 0x420,
  'Random' = 0x450,
  'Repeat' = 0x452,
  'NextTrack' = 0xc34
}

export enum DeckStatus {
  'Play',
  'Stop',
  'Pause',
  'Load',
  'Unload',
  'SearchForward',
  'SearchBackward',
  'FastForward',
  'FastBackward',
  'Empty',
  'Retract'
}

export enum DeckEvent {
  'NormalOperation',
  'DeckError',
  'OverTemp',
  'UnderTemp',
  'UnderVoltage',
  'OverVoltage'
}

export enum MediaEvent {
  'NormalOperation',
  'CorruptedCD',
  'EndOfCD',
  'CorruptedROM',
  'StartPosition',
  'TOCUnreadable',
  'DiskNotAvailable',
  'EndOfFile'
}

export enum Random {
  'Off',
  'Reserved',
  'Disk',
  'Magazines',
  'AllMagazines'
}

export enum Repeat {
  'Off',
  'Track',
  'Disk',
  'Magazine',
  'AllMagazines',
  'Chapeter',
  'Title',
  'AB'
}

export enum TunerTypes {
  'fm1' = 1,
  'fm2' = 2,
  'am' = 3,
  'fma' = 4
}
