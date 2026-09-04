import { useEffect, useState } from 'react'
import { Alert, Box, Button, LinearProgress, MenuItem, Select, Typography } from '@mui/material'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded'
import { socket } from '../../store/store'
import SettingsPage from './SettingsPage'

export default function SoftwareUpdate() {
  const [releases, setReleases] = useState<Array<{ id: number; tag: string; name: string; supported: boolean }>>([])
  const [selected, setSelected] = useState<number | ''>('')
  const [status, setStatus] = useState('Not checked')
  const [progress, setProgress] = useState<number | null>(null)
  const refresh = () => {
    setStatus('Checking releases…')
    socket.emit('update:list', (result: { releases?: Array<{ id: number; tag: string; name: string; supported: boolean }>; error?: string }) => {
      if (result.error) return setStatus(result.error)
      const next = result.releases || []
      setReleases(next)
      setSelected(next.find((release) => release.supported)?.id || '')
      setStatus(next.length ? `${next.length} releases found` : 'No releases found')
    })
  }
  useEffect(() => {
    const handleProgress = (value: { percent?: number; message: string }) => { setProgress(value.percent ?? null); setStatus(value.message) }
    socket.on('update:progress', handleProgress)
    return () => { socket.off('update:progress', handleProgress) }
  }, [])
  const install = () => {
    if (selected === '') return
    setStatus('Starting update…')
    socket.emit('update:install', { releaseId: selected }, (result: { ok: boolean; message: string }) => setStatus(result.message))
  }
  return <SettingsPage title="Software update">
    <Box sx={{ height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.2 }}>
      <Box className="glass-panel" sx={{ p: 2, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 1 }}><SystemUpdateAltRoundedIcon color="primary" /><Typography sx={{ fontSize: 18, fontWeight: 600 }}>GitHub releases</Typography><Select size="small" displayEmpty value={selected} onChange={(event) => setSelected(Number(event.target.value))}><MenuItem value="" disabled>Select release</MenuItem>{releases.map((release) => <MenuItem key={release.id} value={release.id} disabled={!release.supported}>{release.tag} · {release.name}</MenuItem>)}</Select>{progress != null && <LinearProgress variant="determinate" value={progress} />}<Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{status}</Typography><Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}><Button variant="outlined" onClick={refresh}>Check releases</Button><Button variant="contained" disabled={selected === ''} onClick={install}>Install</Button></Box></Box>
      <Box className="glass-panel" sx={{ p: 2, borderRadius: 3, display: 'flex', flexDirection: 'column' }}><RestartAltRoundedIcon color="warning" /><Typography sx={{ mt: 1, fontSize: 18, fontWeight: 600 }}>Restart system</Typography><Typography sx={{ my: 1, fontSize: 12, color: 'text.secondary' }}>Requests an operating-system restart from the Electron backend.</Typography><Alert severity="warning" sx={{ fontSize: 11 }}>Restart is immediate.</Alert><Button sx={{ mt: 'auto' }} color="warning" variant="contained" onClick={() => socket.emit('system:reboot')}>Reboot</Button></Box>
    </Box>
  </SettingsPage>
}
