import { promises as dns } from 'dns'
import os from 'os'
import { EventEmitter } from 'events'
import { execFile } from 'child_process'
import { promisify } from 'util'
import { Socket } from './Socket'

const execFileAsync = promisify(execFile)

export type SystemInfoSnapshot = {
  platform: NodeJS.Platform
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
  checkedAt: string
}

export class SystemInfo extends EventEmitter {
  private readonly socket: Socket
  private readonly appVersion: string
  private readonly timer: NodeJS.Timeout
  private current: SystemInfoSnapshot | null = null

  constructor(socket: Socket, appVersion: string) {
    super()
    this.socket = socket
    this.appVersion = appVersion
    this.socket.on('systemInfo:get', () => void this.refresh())
    this.socket.on('newConnection', () => {
      if (this.current) this.socket.sendSystemInfo(this.current)
      else void this.refresh()
    })
    void this.refresh()
    this.timer = setInterval(() => void this.refresh(), 15_000)
    this.timer.unref()
  }

  async refresh(): Promise<SystemInfoSnapshot> {
    const ipAddresses = Object.values(os.networkInterfaces())
      .flatMap((entries) => entries ?? [])
      .filter((entry) => !entry.internal && (entry.family === 'IPv4' || entry.family === 4))
      .map((entry) => entry.address)
    const locale = Intl.DateTimeFormat().resolvedOptions().locale
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const uses24HourClock = !new Intl.DateTimeFormat(locale, { hour: 'numeric' })
      .resolvedOptions().hour12
    const cpus = os.cpus()

    const snapshot: SystemInfoSnapshot = {
      platform: process.platform,
      platformName: this.platformName(),
      release: os.release(),
      architecture: os.arch(),
      hostname: os.hostname(),
      locale,
      timeZone,
      uses24HourClock,
      networkConnected: ipAddresses.length > 0,
      internetConnected: ipAddresses.length > 0 && (await this.hasInternetAccess()),
      ipAddresses,
      uptimeSeconds: os.uptime(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      cpuModel: cpus[0]?.model ?? 'Unknown',
      cpuCount: cpus.length,
      cpuTemperature: await this.cpuTemperature(),
      appVersion: this.appVersion,
      checkedAt: new Date().toISOString()
    }

    this.current = snapshot
    this.socket.sendSystemInfo(snapshot)
    this.emit('status', snapshot)
    return snapshot
  }

  private async hasInternetAccess(): Promise<boolean> {
    try {
      await Promise.race([
        dns.lookup('example.com'),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Internet check timed out')), 2500)
        )
      ])
      return true
    } catch {
      return false
    }
  }

  private async cpuTemperature(): Promise<number | null> {
    if (process.platform === 'linux') {
      try {
        const raw = await import('fs/promises').then((fs) =>
          fs.readFile('/sys/class/thermal/thermal_zone0/temp', 'utf8')
        )
        const value = Number(raw.trim())
        if (Number.isFinite(value)) return value > 1000 ? value / 1000 : value
      } catch {
        return null
      }
    }

    if (process.platform === 'darwin') {
      try {
        const { stdout } = await execFileAsync('osx-cpu-temp')
        const value = Number.parseFloat(stdout)
        return Number.isFinite(value) ? value : null
      } catch {
        return null
      }
    }

    return null
  }

  private platformName(): string {
    if (process.platform === 'darwin') return 'macOS'
    if (process.platform === 'win32') return 'Windows'
    if (process.platform === 'linux') {
      return os.arch().startsWith('arm') || os.arch() === 'aarch64' ? 'Linux (Raspberry Pi)' : 'Linux'
    }
    return process.platform
  }
}
