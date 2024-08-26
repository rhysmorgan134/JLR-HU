import { Action } from '../../Globals'

export type CanGatewayStatus = {
  autoLock: boolean
  driveAwayLocking: number
  globalWindowClose: boolean
  globalWindowOpen: boolean
  ambientLight: number
  lights: boolean
  mirrorFoldBack: boolean
  passiveArming: boolean
  parkingActive: boolean
  avgMpg: number
  range: number
  alarmSensors: boolean
  distance: number
  avgSpeed: number
  twoStageLocking: boolean
  externalTemp: number
  parkingSensors: Partial<ParkingSensors>
  hours: number
  minutes: number
  mirrorDip: boolean
}

type ParkingSensors = {
  frontLeft: number
  frontCentreLeft: number
  frontCentreRight: number
  frontRight: number
  rearLeft: number
  rearCentreLeft: number
  rearCentreRight: number
  rearRight: number
}

export type DriveAwayLocking = number

export const DRIVE_AWAY_LOCKING = (speed: DriveAwayLocking): Action => {
  return {
    fktID: 0xe27,
    opType: 0x00,
    data: [speed],
    type: 'CanGateway',
    method: 'properties'
  }
}

export const TWO_STAGE_UNLOCKING = (enabled: boolean): Action => {
  return {
    fktID: 0xea0,
    opType: 0x00,
    data: [enabled],
    type: 'CanGateway',
    method: 'properties'
  }
}

export const PASSIVE_ARMING = (enabled: boolean): Action => {
  return {
    fktID: 0xe29,
    opType: 0x00,
    data: [enabled],
    type: 'CanGateway',
    method: 'properties'
  }
}

export const AUTO_RELOCK = (enabled: boolean): Action => {
  return {
    fktID: 0xe2a,
    opType: 0x00,
    data: [enabled],
    type: 'CanGateway',
    method: 'properties'
  }
}

export const ALARM_SENSORS = (enabled: boolean): Action => {
  return {
    fktID: 0xe09,
    opType: 0x00,
    data: [!enabled],
    type: 'CanGateway',
    method: 'properties'
  }
}

export const GLOBAL_WINDOWS_OPEN = (enabled: boolean): Action => {
  const data = enabled ? 0x11 : 0x01
  return {
    fktID: 0xe21,
    opType: 0x00,
    data: [data],
    type: 'CanGateway',
    method: 'properties'
  }
}

export const GLOBAL_WINDOWS_CLOSE = (enabled: boolean): Action => {
  const data = enabled ? 0x22 : 0x02
  return {
    fktID: 0xe21,
    opType: 0x00,
    data: [data],
    type: 'CanGateway',
    method: 'properties'
  }
}

export const MIRROR_FOLDBACK = (enabled: boolean): Action => {
  return {
    fktID: 0xe17,
    opType: 0x00,
    data: [enabled],
    type: 'CanGateway',
    method: 'properties'
  }
}

export const MIRROR_DIP = (enabled: boolean): Action => {
  return {
    fktID: 0xe17,
    opType: 0x00,
    data: [0x00, enabled],
    type: 'CanGateway',
    method: 'properties'
  }
}
