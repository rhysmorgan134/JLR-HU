export type UpdateRelease = {
  id: number
  tag: string
  name: string
  publishedAt: string
  notes: string
  prerelease: boolean
  assetName: string | null
  assetSize: number | null
  supported: boolean
}

export type UpdateRuntime = {
  version: string
  platform: NodeJS.Platform
  arch: string
  packaged: boolean
}

export type UpdateProgress = {
  releaseId: number
  phase: 'downloading' | 'installing' | 'ready' | 'error'
  percent: number | null
  transferred: number
  total: number | null
  message: string
}

export type UpdateResult = { ok: boolean; message: string }
