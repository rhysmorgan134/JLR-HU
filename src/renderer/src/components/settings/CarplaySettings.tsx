import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  MenuItem,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import DirectionsCarFilledRoundedIcon from '@mui/icons-material/DirectionsCarFilledRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded'
import MicRoundedIcon from '@mui/icons-material/MicRounded'
import SettingsPage from './SettingsPage'
import { useCarplayStore } from '../../store/store'
import type { ExtraConfig } from '../../../../main/Globals'

type NumericSetting = 'width' | 'height' | 'fps' | 'dpi' | 'format' | 'iBoxVersion' | 'phoneWorkMode' | 'mediaDelay'

function SettingSwitch({ label, detail, checked, onChange }: { label: string; detail: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <Box sx={{ px: 1.2, minHeight: 48, display: 'flex', alignItems: 'center', gap: 1, borderRadius: 2, background: 'rgba(255,255,255,.035)' }}><Box sx={{ minWidth: 0, flex: 1 }}><Typography sx={{ fontSize: 12.5, fontWeight: 600 }}>{label}</Typography><Typography noWrap sx={{ fontSize: 10, color: 'text.secondary' }}>{detail}</Typography></Box><Switch size="small" checked={checked} onChange={(_, value) => onChange(value)} /></Box>
}

export default function CarplaySettings() {
  const settings = useCarplayStore((state) => state.settings)
  const getSettings = useCarplayStore((state) => state.getSettings)
  const saveSettings = useCarplayStore((state) => state.saveSettings)
  const [draft, setDraft] = useState<ExtraConfig | null>(settings)
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([])
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([])
  const [saved, setSaved] = useState(false)

  useEffect(() => { getSettings() }, [getSettings])
  useEffect(() => { if (settings) setDraft(settings) }, [settings])
  useEffect(() => {
    navigator.mediaDevices?.enumerateDevices().then((devices) => {
      setCameras(devices.filter((device) => device.kind === 'videoinput'))
      setMicrophones(devices.filter((device) => device.kind === 'audioinput'))
    }).catch(() => undefined)
  }, [])

  const update = <K extends keyof ExtraConfig>(key: K, value: ExtraConfig[K]) => setDraft((current) => current ? { ...current, [key]: value } : current)
  const updateNumber = (key: NumericSetting, value: string) => {
    const parsed = Number.parseInt(value, 10)
    if (!Number.isNaN(parsed)) update(key, parsed)
  }
  const save = () => {
    if (!draft) return
    saveSettings(draft)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1600)
  }

  return <SettingsPage title="CarPlay settings">
    {!draft ? <Box className="glass-panel" sx={{ height: '100%', borderRadius: 3, display: 'grid', placeItems: 'center' }}><Box sx={{ textAlign: 'center' }}><Typography sx={{ color: 'text.secondary' }}>Loading stored CarPlay settings…</Typography><Button startIcon={<RefreshRoundedIcon />} onClick={getSettings}>Retry</Button></Box></Box> :
      <Box sx={{ height: '100%', minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1.15fr 1fr', gap: 1 }}>
        <Box className="glass-panel" sx={{ minHeight: 0, borderRadius: 2.5, p: 1.2, display: 'grid', alignContent: 'start', gap: .8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: .8 }}><DirectionsCarFilledRoundedIcon color="primary" /><Box><Typography sx={{ fontSize: 13, fontWeight: 700 }}>DONGLE</Typography><Typography sx={{ fontSize: 9.5, color: 'text.secondary', letterSpacing: .8 }}>PHONE &amp; CONNECTION</Typography></Box></Box>
          <TextField size="small" label="Display name" value={draft.boxName} onChange={(event) => update('boxName', event.target.value)} />
          <Box><Typography sx={{ mb: .45, fontSize: 10, color: 'text.secondary' }}>PHONE PLATFORM</Typography><ToggleButtonGroup fullWidth exclusive size="small" value={Boolean(draft.androidWorkMode)} onChange={(_, value) => value !== null && update('androidWorkMode', value)}><ToggleButton value={false}>CarPlay</ToggleButton><ToggleButton value={true}>Android</ToggleButton></ToggleButtonGroup></Box>
          <Box><Typography sx={{ mb: .45, fontSize: 10, color: 'text.secondary' }}>WI-FI BAND</Typography><ToggleButtonGroup fullWidth exclusive size="small" value={draft.wifiType} onChange={(_, value) => value && update('wifiType', value)}><ToggleButton value="2.4ghz">2.4 GHz</ToggleButton><ToggleButton value="5ghz">5 GHz</ToggleButton></ToggleButtonGroup></Box>
          <Box><Typography sx={{ mb: .45, fontSize: 10, color: 'text.secondary' }}>STEERING POSITION</Typography><ToggleButtonGroup fullWidth exclusive size="small" value={draft.hand} onChange={(_, value) => value !== null && update('hand', value)}><ToggleButton value={0}>Left</ToggleButton><ToggleButton value={1}>Right</ToggleButton></ToggleButtonGroup></Box>
        </Box>

        <Box className="glass-panel" sx={{ minHeight: 0, borderRadius: 2.5, p: 1.2, display: 'grid', gridTemplateRows: 'auto auto auto auto', alignContent: 'start', gap: .8 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'primary.main', letterSpacing: 1 }}>VIDEO &amp; AUDIO</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: .65 }}>{(['width', 'height', 'fps', 'dpi', 'format', 'mediaDelay'] as NumericSetting[]).map((key) => <TextField key={key} size="small" label={key === 'mediaDelay' ? 'Audio delay' : key.toUpperCase()} type="number" value={draft[key]} onChange={(event) => updateNumber(key, event.target.value)} sx={{ '& .MuiInputBase-root': { height: 36, fontSize: 11 }, '& .MuiInputLabel-root': { fontSize: 11 } }} />)}</Box>
          <TextField select size="small" label="Microphone mode" value={draft.micType} onChange={(event) => update('micType', event.target.value as 'box' | 'os')}><MenuItem value="os">Operating system</MenuItem><MenuItem value="box">CarPlay dongle</MenuItem></TextField>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: .7 }}><SettingSwitch label="Night mode" detail="Request dark phone UI" checked={draft.nightMode} onChange={(value) => update('nightMode', value)} /><SettingSwitch label="USB audio" detail="Transfer audio via dongle" checked={draft.audioTransferMode} onChange={(value) => update('audioTransferMode', value)} /></Box>
        </Box>

        <Box className="glass-panel" sx={{ minHeight: 0, borderRadius: 2.5, p: 1.2, display: 'flex', flexDirection: 'column', gap: .8 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'primary.main', letterSpacing: 1 }}>DEVICES</Typography>
          <TextField select size="small" label="Reverse camera" value={draft.camera || ''} onChange={(event) => update('camera', event.target.value)} InputProps={{ startAdornment: <VideocamRoundedIcon sx={{ mr: .7, fontSize: 18, color: 'text.secondary' }} /> }}><MenuItem value="">Automatic/default</MenuItem>{cameras.map((device, index) => <MenuItem key={device.deviceId} value={device.deviceId}>{device.label || `Camera ${index + 1}`}</MenuItem>)}</TextField>
          <TextField select size="small" label="Microphone" value={draft.microphone || ''} onChange={(event) => update('microphone', event.target.value)} InputProps={{ startAdornment: <MicRoundedIcon sx={{ mr: .7, fontSize: 18, color: 'text.secondary' }} /> }}><MenuItem value="">Automatic/default</MenuItem>{microphones.map((device, index) => <MenuItem key={device.deviceId} value={device.deviceId}>{device.label || `Microphone ${index + 1}`}</MenuItem>)}</TextField>
          <Box sx={{ display: 'grid', gap: .65 }}><SettingSwitch label="PiMOST audio" detail="Route CarPlay over MOST" checked={draft.piMost} onChange={(value) => update('piMost', value)} /><SettingSwitch label="CAN interface" detail="Enable vehicle CAN input" checked={draft.canbus} onChange={(value) => update('canbus', value)} /></Box>
          <Box sx={{ mt: 'auto', display: 'flex', gap: .7 }}><Button fullWidth size="small" color="inherit" startIcon={<RefreshRoundedIcon />} onClick={getSettings}>Reload</Button><Button fullWidth size="small" variant="contained" startIcon={<SaveRoundedIcon />} onClick={save}>{saved ? 'Saved' : 'Save'}</Button></Box>
        </Box>
      </Box>}
  </SettingsPage>
}
