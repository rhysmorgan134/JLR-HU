import { useMemo, useState } from 'react'
import { Alert, Box, Button, LinearProgress, MenuItem, TextField, Typography } from '@mui/material'
import PowerSettingsNewRoundedIcon from '@mui/icons-material/PowerSettingsNewRounded'
import UsbRoundedIcon from '@mui/icons-material/UsbRounded'
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded'
import PiMostDfu from './PiMostDfu'

type Asset = { name: string; browser_download_url: string }
type Release = { tag_name: string; body: string; assets: Asset[] }

export default function PiMostFirmware({ bootToDfu }: { bootToDfu: () => void }) {
  const [releases, setReleases] = useState<Release[]>([])
  const [releaseTag, setReleaseTag] = useState('')
  const [assetUrl, setAssetUrl] = useState('')
  const [serial, setSerial] = useState('')
  const [status, setStatus] = useState('Idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const selectedRelease = releases.find((release) => release.tag_name === releaseTag)
  const dfu = useMemo(() => new PiMostDfu(setStatus, setProgress), [])

  const loadReleases = async () => {
    setError(null)
    setLoading(true)
    try {
      const response = await fetch('https://api.github.com/repos/rhysmorgan134/pimost-usb/releases')
      if (!response.ok) throw new Error(`Release lookup failed (${response.status})`)
      const result = await response.json() as Release[]
      setReleases(result)
      if (result[0]) setReleaseTag(result[0].tag_name)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason))
    } finally {
      setLoading(false)
    }
  }

  const connect = async () => {
    setError(null)
    try { setSerial(await dfu.connect()) } catch (reason) { setError(reason instanceof Error ? reason.message : String(reason)) }
  }

  const flash = async () => {
    setError(null)
    setProgress(0)
    try {
      const response = await fetch(`https://spring-grass-7116.rhys1802.workers.dev/?url=${encodeURIComponent(assetUrl)}`)
      if (!response.ok) throw new Error(`Firmware download failed (${response.status})`)
      await dfu.update(await response.arrayBuffer())
    } catch (reason) {
      setStatus('Error')
      setError(reason instanceof Error ? reason.message : String(reason))
    }
  }

  const busy = ['Erasing', 'Programming', 'Booting'].includes(status)
  return <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(220px,.8fr) minmax(0,1.2fr)', gap: 1.2 }}>
    <Box className="glass-panel" sx={{ p: 1.3, borderRadius: 2, display: 'grid', gap: 1, alignContent: 'start' }}>
      <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'primary.main', letterSpacing: 1 }}>DFU CONNECTION</Typography>
      <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Put PiMOST into its STM32 bootloader, then select the DFU device when it reconnects.</Typography>
      <Box sx={{ display: 'flex', gap: .8 }}><Button size="small" variant="outlined" startIcon={<PowerSettingsNewRoundedIcon />} onClick={() => { bootToDfu(); setStatus('Waiting for DFU device') }}>Boot to DFU</Button><Button size="small" variant="contained" startIcon={<UsbRoundedIcon />} onClick={connect}>Connect</Button></Box>
      <Typography sx={{ fontSize: 11 }}>Status: <b>{status}</b></Typography>
      <Typography noWrap sx={{ fontSize: 11, color: 'text.secondary' }}>Serial: {serial || 'Not connected'}</Typography>
      {busy || progress > 0 ? <Box><LinearProgress variant="determinate" value={progress} /><Typography sx={{ mt: .35, fontSize: 10, textAlign: 'right' }}>{Math.round(progress)}%</Typography></Box> : null}
      {error ? <Alert severity="error" sx={{ py: 0, fontSize: 10 }}>{error}</Alert> : null}
    </Box>
    <Box className="glass-panel" sx={{ p: 1.3, borderRadius: 2, display: 'grid', gridTemplateRows: 'auto auto auto minmax(0,1fr)', gap: .8, minHeight: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><Typography sx={{ fontSize: 12, fontWeight: 700, color: 'primary.main', letterSpacing: 1 }}>FIRMWARE RELEASE</Typography><Button size="small" onClick={loadReleases} disabled={loading}>{loading ? 'Loading…' : 'Load releases'}</Button></Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: .8 }}><TextField select size="small" label="Release" value={releaseTag} onChange={(event) => { setReleaseTag(event.target.value); setAssetUrl('') }}>{releases.map((release) => <MenuItem key={release.tag_name} value={release.tag_name}>{release.tag_name}</MenuItem>)}</TextField><TextField select size="small" label="Firmware image" value={assetUrl} disabled={!selectedRelease} onChange={(event) => setAssetUrl(event.target.value)}>{selectedRelease?.assets.map((asset) => <MenuItem key={asset.browser_download_url} value={asset.browser_download_url}>{asset.name}</MenuItem>)}</TextField></Box>
      <Button size="small" variant="contained" startIcon={<SystemUpdateAltRoundedIcon />} disabled={!assetUrl || status !== 'Connected' || busy} onClick={flash}>Flash selected firmware</Button>
      <Typography sx={{ minHeight: 0, overflow: 'hidden', whiteSpace: 'pre-wrap', fontSize: 10.5, color: 'text.secondary' }}>{selectedRelease?.body || 'Load releases to view available PiMOST firmware.'}</Typography>
    </Box>
  </Box>
}
