import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { execFile, spawn } from 'child_process'
import { createWriteStream } from 'fs'
import { chmod, copyFile, mkdir, rename, rm } from 'fs/promises'
import { get } from 'https'
import { basename, join } from 'path'
import { UpdateProgress, UpdateRelease, UpdateResult, UpdateRuntime } from './UpdaterTypes'

const RELEASES_URL = 'https://api.github.com/repos/rhysmorgan134/JLR-HU/releases?per_page=30'

type GithubAsset = { name: string; size: number; browser_download_url: string }
type GithubRelease = {
  id: number
  tag_name: string
  name: string | null
  published_at: string
  body: string | null
  prerelease: boolean
  draft: boolean
  assets: GithubAsset[]
}

export class AppUpdater {
  private releases = new Map<number, { release: GithubRelease; asset: GithubAsset | null }>()

  constructor(private getWindow: () => BrowserWindow | null) {}

  register() {
    ipcMain.handle('updater:runtime', (): UpdateRuntime => ({
      version: app.getVersion(),
      platform: process.platform,
      arch: process.arch,
      packaged: app.isPackaged
    }))
    ipcMain.handle('updater:releases', () => this.listReleases())
    ipcMain.handle('updater:install', (_event, releaseId: number) => this.install(releaseId))
    ipcMain.handle('system:reboot', () => this.reboot())
  }

  private selectAsset(assets: GithubAsset[]): GithubAsset | null {
    const archTerms = process.arch === 'arm64'
      ? ['arm64', 'aarch64']
      : process.arch === 'arm'
        ? ['armv7l', 'armv7', 'armhf']
        : ['x64', 'amd64', 'x86_64']
    const platformAssets = assets.filter((asset) => {
      const name = asset.name.toLowerCase()
      if (process.platform === 'win32') return name.endsWith('.exe') && name.includes('setup')
      if (process.platform === 'darwin') return name.endsWith('.dmg')
      return name.endsWith('.appimage')
    })
    return platformAssets.find((asset) => archTerms.some((term) => asset.name.toLowerCase().includes(term)))
      || (platformAssets.length === 1 ? platformAssets[0] : null)
  }

  async listReleases(): Promise<{ runtime: UpdateRuntime; releases: UpdateRelease[] }> {
    const response = await fetch(RELEASES_URL, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'JLR-HU-Updater' }
    })
    if (!response.ok) throw new Error(`GitHub returned ${response.status} ${response.statusText}`)
    const githubReleases = await response.json() as GithubRelease[]
    this.releases.clear()
    const releases = githubReleases.filter((release) => !release.draft).map((release) => {
      const asset = this.selectAsset(release.assets)
      this.releases.set(release.id, { release, asset })
      return {
        id: release.id,
        tag: release.tag_name,
        name: release.name || release.tag_name,
        publishedAt: release.published_at,
        notes: release.body || '',
        prerelease: release.prerelease,
        assetName: asset?.name || null,
        assetSize: asset?.size || null,
        supported: asset !== null
      }
    })
    return { runtime: {
      version: app.getVersion(), platform: process.platform, arch: process.arch, packaged: app.isPackaged
    }, releases }
  }

  private progress(progress: UpdateProgress) {
    this.getWindow()?.webContents.send('updater:progress', progress)
  }

  private download(url: string, destination: string, releaseId: number, redirects = 0): Promise<void> {
    return new Promise((resolve, reject) => {
      if (redirects > 8) return reject(new Error('Too many download redirects'))
      const request = get(url, { headers: { 'User-Agent': 'JLR-HU-Updater' } }, (response) => {
        if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          response.resume()
          const redirected = new URL(response.headers.location, url).toString()
          this.download(redirected, destination, releaseId, redirects + 1).then(resolve, reject)
          return
        }
        if (response.statusCode !== 200) {
          response.resume()
          reject(new Error(`Download returned HTTP ${response.statusCode}`))
          return
        }
        const total = response.headers['content-length'] ? Number(response.headers['content-length']) : null
        let transferred = 0
        const output = createWriteStream(destination)
        response.on('data', (chunk: Buffer) => {
          transferred += chunk.length
          this.progress({ releaseId, phase: 'downloading', percent: total ? transferred / total * 100 : null, transferred, total, message: 'Downloading update' })
        })
        response.pipe(output)
        output.on('finish', () => output.close(() => resolve()))
        output.on('error', reject)
        response.on('error', reject)
      })
      request.on('error', reject)
    })
  }

  private async install(releaseId: number): Promise<UpdateResult> {
    try {
      if (!app.isPackaged) return { ok: false, message: 'Updates can only be installed from a packaged build.' }
      let selected = this.releases.get(releaseId)
      if (!selected) {
        await this.listReleases()
        selected = this.releases.get(releaseId)
      }
      if (!selected?.asset) return { ok: false, message: 'This release has no compatible installer for this platform and architecture.' }
      const updateDirectory = join(app.getPath('userData'), 'updates')
      await mkdir(updateDirectory, { recursive: true })
      const destination = join(updateDirectory, `${releaseId}-${basename(selected.asset.name)}`)
      await rm(destination, { force: true })
      await this.download(selected.asset.browser_download_url, destination, releaseId)
      this.progress({ releaseId, phase: 'installing', percent: 100, transferred: selected.asset.size, total: selected.asset.size, message: 'Starting installer' })

      if (process.platform === 'win32') {
        spawn(destination, ['/S'], { detached: true, stdio: 'ignore' }).unref()
        setTimeout(() => app.quit(), 500)
        return { ok: true, message: 'Installer started. The application will close.' }
      }
      if (process.platform === 'darwin') {
        const error = await shell.openPath(destination)
        if (error) throw new Error(error)
        return { ok: true, message: 'The update disk image has opened. Replace JLR-HU in Applications, then relaunch it.' }
      }

      const currentAppImage = process.env.APPIMAGE
      if (!currentAppImage) return { ok: false, message: 'This Linux build is not running from an AppImage.' }
      const staged = `${currentAppImage}.update`
      const backup = `${currentAppImage}.previous`
      await copyFile(destination, staged)
      await chmod(staged, 0o755)
      await rm(backup, { force: true })
      await rename(currentAppImage, backup)
      try {
        await rename(staged, currentAppImage)
      } catch (error) {
        await rename(backup, currentAppImage)
        throw error
      }
      spawn(currentAppImage, [], { detached: true, stdio: 'ignore', env: process.env }).unref()
      setTimeout(() => app.quit(), 500)
      return { ok: true, message: 'AppImage replaced. Restarting now.' }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      this.progress({ releaseId, phase: 'error', percent: null, transferred: 0, total: null, message })
      return { ok: false, message }
    }
  }

  private reboot(): Promise<UpdateResult> {
    const command = process.platform === 'win32'
      ? { file: 'shutdown.exe', args: ['/r', '/t', '0'] }
      : process.platform === 'darwin'
        ? { file: 'osascript', args: ['-e', 'tell application "System Events" to restart'] }
        : { file: 'systemctl', args: ['reboot'] }
    return new Promise((resolve) => {
      execFile(command.file, command.args, (error) => resolve(error
        ? { ok: false, message: error.message }
        : { ok: true, message: 'Reboot requested.' }))
    })
  }
}
