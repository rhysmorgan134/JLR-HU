import { useEffect, useMemo, useState } from 'react'
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, MenuItem, Select, Typography } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded'
import { useNavigate } from 'react-router-dom'
import { UpdateProgress, UpdateRelease, UpdateRuntime } from '../../../../main/UpdaterTypes'

const platformName = (platform?: NodeJS.Platform) => platform === 'darwin' ? 'macOS' : platform === 'win32' ? 'Windows' : platform === 'linux' ? 'Linux AppImage' : platform || 'Unknown'
const sizeLabel = (bytes: number | null) => bytes == null ? '' : `${(bytes / 1024 / 1024).toFixed(1)} MB`

export default function SoftwareUpdate() {
  const navigate = useNavigate()
  const [runtime, setRuntime] = useState<UpdateRuntime | null>(null)
  const [releases, setReleases] = useState<UpdateRelease[]>([])
  const [selectedId, setSelectedId] = useState<number | ''>('')
  const [loading, setLoading] = useState(false)
  const [installing, setInstalling] = useState(false)
  const [progress, setProgress] = useState<UpdateProgress | null>(null)
  const [message, setMessage] = useState<{ severity: 'success' | 'error' | 'info'; text: string } | null>(null)
  const [confirmReboot, setConfirmReboot] = useState(false)
  const selected = useMemo(() => releases.find((release) => release.id === selectedId) || null, [releases, selectedId])

  const loadReleases = async () => {
    setLoading(true)
    setMessage(null)
    try {
      const response = await window.api.updaterReleases()
      setRuntime(response.runtime)
      setReleases(response.releases)
      const preferred = response.releases.find((release) => release.supported)
      setSelectedId((current) => response.releases.some((release) => release.id === current) ? current : preferred?.id || '')
    } catch (error) {
      setMessage({ severity: 'error', text: error instanceof Error ? error.message : String(error) })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    window.api.updaterRuntime().then(setRuntime).catch(() => undefined)
    loadReleases()
    return window.api.updaterProgress(setProgress)
  }, [])

  const install = async () => {
    if (selectedId === '') return
    setInstalling(true)
    setMessage(null)
    const result = await window.api.updaterInstall(selectedId)
    setMessage({ severity: result.ok ? 'success' : 'error', text: result.message })
    if (!result.ok || runtime?.platform === 'darwin') setInstalling(false)
  }

  const reboot = async () => {
    setConfirmReboot(false)
    const result = await window.api.reboot()
    if (!result.ok) setMessage({ severity: 'error', text: result.message })
  }

  return <Box sx={{ height: '100%', p: 1.5, display: 'grid', gridTemplateRows: '48px minmax(0,1fr)', gap: 1.2, overflow: 'hidden' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box className="settings-back" onClick={() => navigate('/settings')}><ArrowBackRoundedIcon /></Box>
      <Box sx={{ flex: 1 }}><Typography sx={{ fontSize: 24, fontWeight: 600 }}>Software update</Typography><Typography sx={{ mt: -.4, color: 'text.secondary', fontSize: 11, letterSpacing: 1.2 }}>RELEASES &amp; SYSTEM POWER</Typography></Box>
      <Button startIcon={<RestartAltRoundedIcon />} color="warning" variant="outlined" onClick={() => setConfirmReboot(true)}>Reboot</Button>
    </Box>

    <Box sx={{ minHeight: 0, display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) minmax(240px,.7fr)', gap: 1.2 }}>
      <Box className="glass-panel" sx={{ borderRadius: 3, p: 1.7, minWidth: 0, display: 'grid', gridTemplateRows: 'auto auto minmax(0,1fr) auto', gap: 1.25 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}><Box sx={{ width: 44, height: 44, borderRadius: 2.2, display: 'grid', placeItems: 'center', color: 'primary.main', background: 'var(--accent-soft)' }}><SystemUpdateAltRoundedIcon /></Box><Box><Typography sx={{ fontSize: 18, fontWeight: 600 }}>Choose a GitHub release</Typography><Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>Current version {runtime?.version || '—'} · {platformName(runtime?.platform)} · {runtime?.arch || '—'}</Typography></Box></Box>
        <Box sx={{ display: 'flex', gap: 1 }}><Select size="small" fullWidth displayEmpty value={selectedId} onChange={(event) => setSelectedId(Number(event.target.value))} disabled={loading || installing}><MenuItem value="" disabled>{loading ? 'Checking GitHub…' : 'Select a release'}</MenuItem>{releases.map((release) => <MenuItem key={release.id} value={release.id} disabled={!release.supported}>{release.tag} — {release.name}{release.prerelease ? ' (pre-release)' : ''}{!release.supported ? ' · no compatible asset' : ''}</MenuItem>)}</Select><Button variant="outlined" onClick={loadReleases} disabled={loading || installing} sx={{ minWidth: 112 }} startIcon={<RefreshRoundedIcon />}>Refresh</Button></Box>
        <Box sx={{ minHeight: 0, borderRadius: 2, p: 1.4, background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.08)', overflow: 'hidden' }}>{selected ? <><Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}><Typography sx={{ fontSize: 16, fontWeight: 600 }}>{selected.name}</Typography><Typography sx={{ color: 'text.secondary', fontSize: 11 }}>{new Date(selected.publishedAt).toLocaleDateString()}</Typography></Box><Typography sx={{ mt: .5, color: 'primary.main', fontSize: 11 }}>{selected.assetName} {sizeLabel(selected.assetSize)}</Typography><Typography sx={{ mt: .8, color: 'text.secondary', whiteSpace: 'pre-wrap', fontSize: 11, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{selected.notes || 'No release notes supplied.'}</Typography></> : <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>No compatible release selected.</Typography>}</Box>
        <Box>{progress && installing ? <Box sx={{ mb: 1 }}><Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{progress.message}</Typography><Typography sx={{ fontSize: 11 }}>{progress.percent == null ? '…' : `${progress.percent.toFixed(0)}%`}</Typography></Box><LinearProgress variant={progress.percent == null ? 'indeterminate' : 'determinate'} value={progress.percent || 0} sx={{ mt: .5 }} /></Box> : null}<Button fullWidth variant="contained" startIcon={<SystemUpdateAltRoundedIcon />} disabled={!selected?.supported || installing || loading} onClick={install}>{installing ? 'Installing…' : `Install ${selected?.tag || 'selected release'}`}</Button></Box>
      </Box>

      <Box className="glass-panel" sx={{ borderRadius: 3, p: 1.7, display: 'flex', flexDirection: 'column', gap: 1.2 }}><Typography sx={{ fontSize: 15, fontWeight: 600 }}>Installation behaviour</Typography><Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>{runtime?.platform === 'linux' ? 'The running AppImage is replaced atomically. The previous image is retained with a .previous suffix, then the app restarts.' : runtime?.platform === 'win32' ? 'The NSIS installer runs silently and the application closes while it installs.' : 'The downloaded DMG opens so macOS can verify it and you can replace the application.'}</Typography>{runtime && !runtime.packaged ? <Alert severity="info" sx={{ mt: .5, fontSize: 11 }}>Development builds can browse releases but cannot install them.</Alert> : null}{message ? <Alert severity={message.severity} sx={{ mt: 'auto', fontSize: 11 }}>{message.text}</Alert> : null}</Box>
    </Box>

    <Dialog open={confirmReboot} onClose={() => setConfirmReboot(false)}><DialogTitle>Reboot this system?</DialogTitle><DialogContent><Typography sx={{ color: 'text.secondary' }}>The operating system will restart immediately. Any unsaved work outside this app may be lost.</Typography></DialogContent><DialogActions><Button onClick={() => setConfirmReboot(false)}>Cancel</Button><Button color="warning" variant="contained" onClick={reboot}>Reboot now</Button></DialogActions></Dialog>
  </Box>
}
