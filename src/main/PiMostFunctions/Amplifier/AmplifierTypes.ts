import { Action } from "../../Globals";

export enum SurroundType  {
  'stereo'= 0,
  '3Channel' = 1,
  'dolbyProLogic'= 2
}

export type SurroundEntry = 'stereo' | 'surround' | 'dolbyProLogic'
export const SET_BALANCE = (balance: number): Action => {
  return {
    fktId: 0x200,
    opType: 0x00,
    data: [balance],
    type: 'Amplifier',
    method: 'properties'
  }
}

export const INC_BALANCE: Action = {
  fktId: 0x200,
  opType: 0x03,
  data: [],
  type: 'Amplifier',
  method: 'properties'
}

export const DEC_BALANCE: Action = {
  fktId: 0x200,
  opType: 0x04,
  data: [],
  type: 'Amplifier',
  method: 'properties'
}

export const SET_BASS = (bass: number): Action => {
  return {
    fktId: 0x202,
    opType: 0x00,
    data: [bass],
    type: 'Amplifier',
    method: 'properties'
  }
}

export const INC_BASS: Action = {
  fktId: 0x202,
  opType: 0x03,
  data: [],
  type: 'Amplifier',
  method: 'properties'
}

export const DEC_BASS: Action = {
  fktId: 0x202,
  opType: 0x04,
  data: [],
  type: 'Amplifier',
  method: 'properties'
}

export const SET_TREBLE = (treble: number): Action => {
  console.log("setting treble")
  return {
    fktId: 0x203,
    opType: 0x00,
    data: [treble],
    type: 'Amplifier',
    method: 'properties'
  }
}

export const SET_FADER = (fader: number): Action => {
  return {
    fktId: 0x204,
    opType: 0x00,
    data: [fader],
    type: 'Amplifier',
    method: 'properties'
  }
}

export const INC_TREBLE: Action = {
  fktId: 0x203,
  opType: 0x03,
  data: [],
  type: 'Amplifier',
  method: 'properties'
}

export const DEC_TRBLE: Action = {
  fktId: 0x203,
  opType: 0x04,
  data: [],
  type: 'Amplifier',
  method: 'properties'
}

export const SET_SUBWOOFER = (subwoofer: number): Action => {
  return {
    fktId: 0x402,
    opType: 0x00,
    data: [subwoofer],
    type: 'Amplifier',
    method: 'properties'
  }
}

export const INC_SUBWOOFER: Action = {
  fktId: 0x402,
  opType: 0x03,
  data: [],
  type: 'Amplifier',
  method: 'properties'
}

export const DEC_SUBWOOFER: Action = {
  fktId: 0x402,
  opType: 0x04,
  data: [],
  type: 'Amplifier',
  method: 'properties'
}

export const SET_CENTRE = (mode: SurroundEntry, centre: number): Action => {
  return {
    fktId: 0xE20,
    opType: 0x00,
    data: [SurroundType[mode], centre],
    type: 'Amplifier',
    method: 'properties'
  }
}

export const SET_MODE = (mode: number): Action => {
  console.log("mode set", )
  return {
    fktId: 0xE22,
    opType: 0x00,
    data: [mode],
    type: 'Amplifier',
    method: 'properties'
  }
}


