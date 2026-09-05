import { execFile } from 'child_process'
import { mkdtemp, rm, writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { SocketMostUsb } from 'socketmost'
import winston from 'winston'
import { Socket } from '../Socket'

export class PiMostFirmwareBackend {
  private logger = winston.loggers.get('pimost')

  constructor(private socketmost: SocketMostUsb, private socket: Socket) {
    socket.on('piMostFirmware:bootToDfu', () => this.bootToDfu())
    socket.on('piMostFirmware:flash', ({ data, callback }) => this.flash(data, callback))
  }

  private bootToDfu(): void {
    if (!this.socketmost.port?.isOpen) {
      this.socket.sendFirmwareProgress({ message: 'PiMOST interface is not connected.' })
      return
    }
    this.logger.warn('Rebooting PiMOST USB into DFU mode')
    this.socket.sendFirmwareProgress({ message: 'Waiting for DFU device' })
    this.socketmost.port.write(Buffer.from([0x55, 0x01, 0x63]))
  }

  private async flash(request: { name?: string; data?: ArrayBuffer | Buffer | { data?: number[] } }, callback?: (result: { ok: boolean; message: string }) => void): Promise<void> {
    let directory: string | null = null
    try {
      const name = typeof request?.name === 'string' ? request.name : 'pimost.bin'
      const bytes = request?.data instanceof ArrayBuffer
        ? Buffer.from(request.data)
        : Buffer.from((request?.data as { data?: number[] })?.data || (request?.data as Buffer) || [])
      if (!bytes.length) throw new Error('The firmware image is empty.')
      directory = await mkdtemp(join(tmpdir(), 'jlr-hu-pimost-'))
      const firmwarePath = join(directory, name.replace(/[^a-zA-Z0-9._-]/g, '_'))
      await writeFile(firmwarePath, bytes)
      this.socket.sendFirmwareProgress({ percent: 0, message: 'Programming PiMOST firmware' })
      await new Promise<void>((resolve, reject) => {
        execFile('dfu-util', ['-a', '0', '-s', '0x08000000:leave', '-D', firmwarePath], (error, stdout, stderr) => {
          if (error) return reject(new Error((stderr || stdout || error.message).trim()))
          resolve()
        })
      })
      this.socket.sendFirmwareProgress({ percent: 100, message: 'Firmware installed; PiMOST is rebooting' })
      callback?.({ ok: true, message: 'Firmware installed successfully.' })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      this.logger.error(`PiMOST firmware update failed: ${message}`)
      this.socket.sendFirmwareProgress({ message: `Firmware update failed: ${message}` })
      callback?.({ ok: false, message })
    } finally {
      if (directory) await rm(directory, { recursive: true, force: true })
    }
  }
}
