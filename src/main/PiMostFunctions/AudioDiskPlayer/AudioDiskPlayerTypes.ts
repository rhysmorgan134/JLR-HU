// 0x200: new DeckStatus(0x200, this.sendMessage.bind(this), this.updateStatus.bind(this)),
//   0x201: new TimePosition(0x0201, this.sendMessage.bind(this), this.updateStatus.bind(this)),
//   0x202: new TrackPosition(0x202, this.sendMessage.bind(this), this.updateStatus.bind(this)),
//   0x412: new ActiveDisk(0x412, this.sendMessage.bind(this), this.updateStatus.bind(this)),
//   0x413: new MediaInfo(0x413, this.sendMessage.bind(this), this.updateStatus.bind(this)),
//   0x420: new AudioDiskInfo(0x420, this.sendMessage.bind(this), this.updateStatus.bind(this)),
//   0x450: new RandomCd(0x450, this.sendMessage.bind(this), this.updateStatus.bind(this)),
//   0xc34: new NextTrack(0xc34, this.sendMessage.bind(this), this.updateStatus.bind(this)),

import { Action } from '../../Globals'
export const NEXT_TRACK: Action = {
  fktId: 0x202,
  opType: 0x03,
  data: [1],
  type: 'AudioDiskPlayer',
  method: 'properties'
}

export const PREV_TRACK: Action = {
  fktId: 0x202,
  opType: 0x04,
  data: [1],
  type: 'AudioDiskPlayer',
  method: 'properties'
}

export const PLAY: Action = {
  fktId: 0x200,
  opType: 0x00,
  data: [0x00],
  type: 'AudioDiskPlayer',
  method: 'properties'
}

export const PAUSE: Action = {
  fktId: 0x200,
  opType: 0x00,
  data: [0x00],
  type: 'AudioDiskPlayer',
  method: 'properties'
}

export enum RandomTypes {
  'off',
  'reserved',
  'disk',
  'magazine',
  'allMagazines'
}
export type RandomType = Record<RandomTypes, string>

export const RANDOM = (randomType: string): Action => {
  return {
    fktId: 0x450,
    opType: 0x00,
    data: [RandomTypes[randomType]],
    type: 'AudioDiskPlayer',
    method: 'properties'
  }
}

export const ACTIVE_DISK = (activeDisk: number): Action => {
  return {
    fktId: 0x412,
    opType: 0x00,
    data: [activeDisk],
    type: 'AudioDiskPlayer',
    method: 'properties'
  }
}

export enum RepeatTypes {
  'off',
  'track',
  'disk',
  'magazine',
  'allMagazines'
}
export type RepeatType = Record<RepeatTypes, string>

export const REPEAT = (repeatType: string): Action => {
  return {
    fktId: 0x452,
    opType: 0x00,
    data: [RepeatTypes[repeatType]],
    type: 'AudioDiskPlayer',
    method: 'properties'
  }
}

export type AudioDiskInfoTypes = {
  trackName: string,
  playTime: number,
  trackNumber: number,
  fileName: string
}


