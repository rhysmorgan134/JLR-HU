import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ExtraConfig } from '../main/Globals'
import { UpdateProgress, UpdateRelease, UpdateResult, UpdateRuntime } from '../main/UpdaterTypes'

type ApiCallback = (event: IpcRendererEvent, ...args: unknown[]) => void

export interface Api {
  settings: (callback: ApiCallback) => void
  reverse: (callback: ApiCallback) => void
  getSettings: () => void
  saveSettings: (settings: ExtraConfig) => void
  // stream: (stream: messages.Stream) => void
  quit: () => void
  updaterRuntime: () => Promise<UpdateRuntime>
  updaterReleases: () => Promise<{ runtime: UpdateRuntime; releases: UpdateRelease[] }>
  updaterInstall: (releaseId: number) => Promise<UpdateResult>
  updaterProgress: (callback: (progress: UpdateProgress) => void) => () => void
  reboot: () => Promise<UpdateResult>
}

// Custom APIs for renderer
const api: Api = {
  settings: (callback: ApiCallback) => ipcRenderer.on('settings', callback),
  reverse: (callback: ApiCallback) => ipcRenderer.on('reverse', callback),
  getSettings: () => ipcRenderer.send('getSettings'),
  saveSettings: (settings: ExtraConfig) => ipcRenderer.send('saveSettings', settings),
  // stream: (stream: Stream) => ipcRenderer.send('startStream', stream),
  quit: () => ipcRenderer.send('quit'),
  updaterRuntime: () => ipcRenderer.invoke('updater:runtime'),
  updaterReleases: () => ipcRenderer.invoke('updater:releases'),
  updaterInstall: (releaseId) => ipcRenderer.invoke('updater:install', releaseId),
  updaterProgress: (callback) => {
    const listener = (_event: IpcRendererEvent, progress: UpdateProgress) => callback(progress)
    ipcRenderer.on('updater:progress', listener)
    return () => ipcRenderer.removeListener('updater:progress', listener)
  },
  reboot: () => ipcRenderer.invoke('system:reboot')
}

try {
  contextBridge.exposeInMainWorld('electron', electronAPI)
  contextBridge.exposeInMainWorld('api', api)
  contextBridge.exposeInMainWorld('electronAPI', {
    settings: (callback: ApiCallback) => ipcRenderer.on('settings', callback),
    getSettings: () => ipcRenderer.send('getSettings'),
    saveSettings: (settings: ExtraConfig) => ipcRenderer.send('saveSettings', settings),
    // stream: (stream: Stream) => ipcRenderer.send('startStream', stream),
    quit: () => ipcRenderer.send('quit'),
    updaterRuntime: () => ipcRenderer.invoke('updater:runtime'),
    updaterReleases: () => ipcRenderer.invoke('updater:releases'),
    updaterInstall: (releaseId: number) => ipcRenderer.invoke('updater:install', releaseId),
    updaterProgress: (callback: (progress: UpdateProgress) => void) => {
      const listener = (_event: IpcRendererEvent, progress: UpdateProgress) => callback(progress)
      ipcRenderer.on('updater:progress', listener)
      return () => ipcRenderer.removeListener('updater:progress', listener)
    },
    reboot: () => ipcRenderer.invoke('system:reboot')
  })
} catch (error) {
  console.error(error)
}
