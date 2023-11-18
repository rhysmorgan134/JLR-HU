import { Action } from "../../Globals";

export type PresetListEntry = {
  unknown2: number
  tunerNo2: number
  presetNo2: number
  name: string
  frequency: number
}

export type SubPresetList = Record<number, PresetListEntry>

export type PresetList = {
    presetList: Record<number, SubPresetList>
}

export const GET_PRESETS: Action = {
  fktId: 0xD50,
  opType: 0x01,
  data: [0x00, 0x00, 0x00],
  type: 'AmFmTuner',
  method: 'properties'
}

export const AUTO_STORE: Action = {
  fktId: 0xD13,
  opType: 0x02,
  data: [0x04, 0x09],
  type: 'AmFmTuner',
  method: 'properties'
}

export enum PresetGroupTypes {
  'fm1'= 1,
  'fm2'= 2,
  'am' = 3,
  'fma' = 4
}

export type PresetGroupType = Record<PresetGroupTypes, string>

export const SET_PRESET_GROUP = (prevPreset: number, PresetGroupType: string): Action => {
  return {
    fktId: 0xD00,
    opType: 0x02,
    data: [PresetGroupType.includes('fm') ? 0x01 : 0x02, 3, 6, PresetGroupTypes[PresetGroupType]],
    type: 'AmFmTuner',
    method: 'methods'
  }
}

export const SET_PRESET_GROUP1 = (prevPreset: number): Action => {
  return {
    fktId: 0xD10,
    opType: 0x02,
    data: [6, prevPreset],
    type: 'AmFmTuner',
    method: 'methods'
  }
}

export const CHANGE_STATION = (preset: number, station: number): Action => {
  return {
    fktId: 0xD11,
    opType: 0x02,
    data: [preset, station],
    type: 'AmFmTuner',
    method: 'methods'
  }
}

export const SEEK_FORWARD: Action = {
  fktId: 0xD03,
  opType: 0x02,
  data: [0x11],
  type: 'AmFmTuner',
  method: 'properties'
}

export const SEEK_BACK: Action = {
  fktId: 0xD03,
  opType: 0x02,
  data: [0x31],
  type: 'AmFmTuner',
  method: 'properties'
}

export const SAVE_STATION = (preset, station): Action => {
  return {
    fktId: 0xD10,
    opType: 0x02,
    data: [preset, station],
    type: 'AmFmTuner',
    method: 'properties'
  }

}
