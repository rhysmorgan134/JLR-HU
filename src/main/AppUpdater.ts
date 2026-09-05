import { app, shell } from 'electron'
import { execFile, spawn } from 'child_process'
import { createWriteStream } from 'fs'
import { chmod, copyFile, mkdir, rename, rm } from 'fs/promises'
import { get } from 'https'
import { basename, join } from 'path'
import { Socket } from './Socket'

type GithubAsset = { name: string; size: number; browser_download_url: string }
type GithubRelease = { id: number; tag_name: string; name: string | null; draft: boolean; assets: GithubAsset[] }

export class AppUpdater {
  private releases = new Map<number, GithubAsset | null>()

  constructor(private socket: Socket) {
    socket.on('update:list', (callback) => this.list(callback))
    socket.on('update:install', ({ data, callback }) => this.install(data?.releaseId).then(callback))
    socket.on('system:reboot', () => this.reboot())
  }

  private selectAsset(assets: GithubAsset[]): GithubAsset | null {
    const terms = process.arch === 'arm64' ? ['arm64', 'aarch64'] : process.arch === 'arm' ? ['armv7l', 'armv7', 'armhf'] : ['x64', 'amd64', 'x86_64']
    const candidates = assets.filter(({ name }) => {
      const lower = name.toLowerCase()
      if (process.platform === 'win32') return lower.endsWith('.exe') && lower.includes('setup')
      if (process.platform === 'darwin') return lower.endsWith('.dmg')
      return lower.endsWith('.appimage')
    })
    return candidates.find(({ name }) => terms.some((term) => name.toLowerCase().includes(term))) || (candidates.length === 1 ? candidates[0] : null)
  }

  private async list(callback: (result: { releases: Array<{ id: number; tag: string; name: string; supported: boolean }>; error?: string }) => void): Promise<void> {
    try {
      const response = await fetch('https://api.github.com/repos/rhysmorgan134/JLR-HU/releases?per_page=30', { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'JLR-HU-Updater' } })
      if (!response.ok) throw new Error(`GitHub returned ${response.status} ${response.statusText}`)
      const releases = (await response.json() as GithubRelease[]).filter((release) => !release.draft).map((release) => {
        const asset = this.selectAsset(release.assets)
        this.releases.set(release.id, asset)
        return { id: release.id, tag: release.tag_name, name: release.name || release.tag_name, supported: asset !== null }
      })
      callback({ releases })
    } catch (error) {
      callback({ releases: [], error: error instanceof Error ? error.message : String(error) })
    }
  }

  private download(url: string, destination: string, releaseId: number, redirects = 0): Promise<void> {
    return new Promise((resolve, reject) => {
      if (redirects > 8) return reject(new Error('Too many download redirects'))
      const request = get(url, { headers: { 'User-Agent': 'JLR-HU-Updater' } }, (response) => {
        if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          response.resume()
          this.download(new URL(response.headers.location, url).toString(), destination, releaseId, redirects + 1).then(resolve, reject)
          return
        }
        if (response.statusCode !== 200) return reject(new Error(`Download returned HTTP ${response.statusCode}`))
        const total = response.headers['content-length'] ? Number(response.headers['content-length']) : null
        let transferred = 0
        const output = createWriteStream(destination)
        response.on('data', (chunk: Buffer) => {
          transferred += chunk.length
          this.socket.sendUpdateProgress({ percent: total ? transferred / total * 100 : undefined, message: 'Downloading update' })
        })
        response.pipe(output)
        output.on('finish', () => output.close((error) => error ? reject(error) : resolve()))
        output.on('error', reject)
        response.on('error', reject)
      })
      request.on('error', reject)
    })
  }

  private async install(releaseId: number): Promise<{ ok: boolean; message: string }> {
    try {
      if (!app.isPackaged) return { ok: false, message: 'Updates can only be installed from a packaged build.' }
      const asset = this.releases.get(releaseId)
      if (!asset) return { ok: false, message: 'Refresh releases and select a compatible installer.' }
      const directory = join(app.getPath('userData'), 'updates')
      await mkdir(directory, { recursive: true })
      const destination = join(directory, `${releaseId}-${basename(asset.name)}`)
      await rm(destination, { force: true })
      await this.download(asset.browser_download_url, destination, releaseId)
      this.socket.sendUpdateProgress({ percent: 100, message: 'Starting installer' })
      if (process.platform === 'win32') {
        spawn(destination, ['/S'], { detached: true, stdio: 'ignore' }).unref()
        setTimeout(() => app.quit(), 500)
        return { ok: true, message: 'Installer started.' }
      }
      if (process.platform === 'darwin') {
        const error = await shell.openPath(destination)
        return error ? { ok: false, message: error } : { ok: true, message: 'Update disk image opened.' }
      }
      const current = process.env.APPIMAGE
      if (!current) return { ok: false, message: 'This build is not running from an AppImage.' }
      const staged = `${current}.update`
      const backup = `${current}.previous`
      await copyFile(destination, staged)
      await chmod(staged, 0o755)
      await rm(backup, { force: true })
      await rename(current, backup)
      try { await rename(staged, current) } catch (error) { await rename(backup, current); throw error }
      spawn(current, [], { detached: true, stdio: 'ignore', env: process.env }).unref()
      setTimeout(() => app.quit(), 500)
      return { ok: true, message: 'AppImage updated; restarting.' }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      this.socket.sendUpdateProgress({ message })
      return { ok: false, message }
    }
  }

  private reboot(): void {
    const command = process.platform === 'win32' ? ['shutdown.exe', ['/r', '/t', '0']] as const : process.platform === 'darwin' ? ['osascript', ['-e', 'tell application "System Events" to restart']] as const : ['systemctl', ['reboot']] as const
    execFile(command[0], [...command[1]], (error) => error && this.socket.sendUpdateProgress({ message: `Reboot failed: ${error.message}` }))
  }
}
