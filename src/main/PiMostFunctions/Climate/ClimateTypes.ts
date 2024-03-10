// 0x200: new DeckStatus(0x200, this.sendMessage, this.updateStatus),
//   0x201: new TimePosition(0x0201, this.sendMessage, this.updateStatus),
//   0x202: new TrackPosition(0x202, this.sendMessage, this.updateStatus),
//   0x412: new ActiveDisk(0x412, this.sendMessage, this.updateStatus),
//   0x413: new MediaInfo(0x413, this.sendMessage, this.updateStatus),
//   0x420: new AudioDiskInfo(0x420, this.sendMessage, this.updateStatus),
//   0x450: new RandomCd(0x450, this.sendMessage, this.updateStatus),
//   0xc34: new NextTrack(0xc34, this.sendMessage, this.updateStatus),

import { Action } from '../../Globals'

export const AUTO: Action = {
  fktID: 0xe00,
  opType: 0x00,
  data: [0x02, 0x01],
  type: 'Climate',
  method: 'properties'
}

export const WINDSCREEN = (active: boolean): Action => {
  return {
    fktID: 0xe00,
    opType: 0x00,
    data: [0x13, active ? 0x01 : 0x00, 0x01, 0x01],
    type: 'Climate',
    method: 'properties'
  }
}

export const FACE = (active: boolean): Action => {
  return {
    fktID: 0xe00,
    opType: 0x00,
    data: [0x13, active ? 0x01 : 0x00, 0x02, 0x01],
    type: 'Climate',
    method: 'properties'
  }
}

export const FEET = (active: boolean): Action => {
  return {
    fktID: 0xe00,
    opType: 0x00,
    data: [0x13, active ? 0x01 : 0x00, 0x03, 0x01],
    type: 'Climate',
    method: 'properties'
  }
}

export const AC = (active: boolean): Action => {
  return {
    fktID: 0xe00,
    opType: 0x00,
    data: [0x11, active ? 0x01 : 0x00, 0x01],
    type: 'Climate',
    method: 'properties'
  }
}

export const SYNC: Action = {
  fktID: 0xe00,
  opType: 0x00,
  data: [0x4, 0x01],
  type: 'Climate',
  method: 'properties'
}

// export const WINDSCREEN: Action = {
//   fktID: 0xe00,
//   opType: 0x00,
//   data: [0x13, 0x01, 0x01, 0x01],
//   type: 'Climate',
//   method: 'properties'
// }

export type SeatTemp = -3 | -2 | -1 | 0 | 1 | 2 | 3

export const RIGHT_SEAT_TEMP = (temperature: SeatTemp): Action => {
  let parsedTemperature: SeatTemp | number = temperature
  if (temperature < 0) {
    parsedTemperature = temperature * 1 + 16
  }
  return {
    fktID: 0xe00,
    opType: 0x00,
    data: [0x16, 0x02, parsedTemperature, 0x01],
    type: 'Climate',
    method: 'properties'
  }
}

export const LEFT_SEAT_TEMP = (temperature: SeatTemp): Action => {
  let parsedTemperature: SeatTemp | number = temperature
  console.log('seat temp: ', parsedTemperature)
  if (temperature < 0) {
    switch (temperature) {
      case -1:
        parsedTemperature = 0x11
        break
      case -2:
        parsedTemperature = 0x12
        break
      case -3:
        parsedTemperature = 0x13
        break
    }
  }
  console.log('seat temp: ', parsedTemperature.toString(16))
  return {
    fktID: 0xe00,
    opType: 0x00,
    data: [0x16, 0x01, parsedTemperature, 0x01],
    type: 'Climate',
    method: 'properties'
  }
}
