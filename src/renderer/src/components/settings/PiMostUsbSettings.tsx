import { Box, Button, Chip, FormControlLabel, Switch, TextField, Typography } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import UsbRoundedIcon from '@mui/icons-material/UsbRounded'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UsbSettings } from 'socketmost'
import { useMostSettings } from '../../store/store'
import PiMostFirmware from './PiMostFirmware'

type RouteSettings = UsbSettings['amplifier']
const numericValue = (value: string) => Number.parseInt(value.trim(), value.trim().toLowerCase().startsWith('0x') ? 16 : 10)

function NumberSetting({ label, value, onChange, max = 255 }: { label: string; value: number; onChange: (value: number) => void; max?: number }) {
  const [draft, setDraft] = useState(String(value ?? 0))
  useEffect(() => setDraft(String(value ?? 0)), [value])
  return <TextField size="small" label={label} value={draft} error={Number.isNaN(numericValue(draft)) || numericValue(draft) < 0 || numericValue(draft) > max} onChange={(event) => {
    const next = event.target.value
    setDraft(next)
    const parsed = numericValue(next)
    if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= max) onChange(parsed)
  }} sx={{ '& .MuiInputBase-root': { height: 38, fontSize: 12 }, '& .MuiInputLabel-root': { fontSize: 12 } }} />
}

function RouteEditor({ title, value, onChange }: { title: string; value: RouteSettings; onChange: (value: RouteSettings) => void }) {
  const update = (key: keyof RouteSettings, next: number) => onChange({ ...value, [key]: next })
  return <Box className="glass-panel" sx={{ borderRadius: 2, p: 1.2 }}><Typography sx={{ mb: 1, fontSize: 12, fontWeight: 700, color: 'primary.main', letterSpacing: 1 }}>{title}</Typography><Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: .8 }}><NumberSetting label="FBlock" value={value.fblockId} onChange={(next) => update('fblockId', next)} /><NumberSetting label="Addr high" value={value.targetAddressHigh} onChange={(next) => update('targetAddressHigh', next)} /><NumberSetting label="Addr low" value={value.targetAddressLow} onChange={(next) => update('targetAddressLow', next)} /><NumberSetting label="Instance" value={value.instanceId} onChange={(next) => update('instanceId', next)} /><NumberSetting label="Sink" value={value.sinkNumber} onChange={(next) => update('sinkNumber', next)} /></Box></Box>
}

export default function PiMostUsbSettings() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'interface' | 'routing' | 'firmware'>('interface')
  const [saved, setSaved] = useState(false)
  const { usbSettings, requestSettings, saveSettings, bootToDfu } = useMostSettings()
  const [draft, setDraft] = useState<UsbSettings>(usbSettings)

  useEffect(() => { requestSettings() }, [])
  useEffect(() => { setDraft(usbSettings) }, [usbSettings])
  const update = <K extends keyof UsbSettings>(key: K, value: UsbSettings[K]) => setDraft((current) => ({ ...current, [key]: value }))
  const save = () => {
    saveSettings(draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return <Box sx={{ height: '100%', p: 1, display: 'grid', gridTemplateRows: '46px minmax(0,1fr)', gap: 1 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box className="settings-back" onClick={() => navigate('/settings')}><ArrowBackRoundedIcon /></Box><UsbRoundedIcon sx={{ ml: .4, color: 'primary.main' }} /><Box sx={{ mr: 'auto' }}><Typography sx={{ fontSize: 20, fontWeight: 600, lineHeight: 1.05 }}>PiMOST USB</Typography><Typography sx={{ fontSize: 10, color: 'text.secondary', letterSpacing: 1.1 }}>INTERFACE CONFIGURATION</Typography></Box><Chip size="small" label={draft.version ? `FW ${draft.version}` : 'Waiting for interface'} color={draft.version ? 'success' : 'default'} variant="outlined" /><Button size="small" color="inherit" startIcon={<RefreshRoundedIcon />} onClick={requestSettings}>Refresh</Button><Button size="small" variant="contained" disabled={!draft.version} startIcon={<SaveRoundedIcon />} onClick={save}>{saved ? 'Saved' : 'Save to PiMOST'}</Button></Box>
    <Box className="glass-panel" sx={{ borderRadius: 2.5, minHeight: 0, display: 'grid', gridTemplateRows: '42px minmax(0,1fr)', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', borderBottom: '1px solid var(--stroke)' }}>{(['interface', 'routing', 'firmware'] as const).map((item) => <Button key={item} onClick={() => setTab(item)} sx={{ minWidth: 150, borderRadius: 0, color: tab === item ? 'primary.main' : 'text.secondary', borderBottom: tab === item ? '2px solid' : '2px solid transparent' }}>{item === 'interface' ? 'Interface & power' : item === 'routing' ? 'Standalone routing' : 'Firmware update'}</Button>)}</Box>
      <Box sx={{ minHeight: 0, overflowY: 'auto', p: 1.4 }}>
        {tab === 'interface' ? <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1.1 }}>
          <NumberSetting label="Node address high" value={draft.nodeAddressHigh} onChange={(value) => update('nodeAddressHigh', value)} />
          <NumberSetting label="Node address low" value={draft.nodeAddressLow} onChange={(value) => update('nodeAddressLow', value)} />
          <NumberSetting label="Group address" value={draft.groupAddress} onChange={(value) => update('groupAddress', value)} />
          <NumberSetting label="Shutdown delay (ms)" value={draft.shutdownTimeDelay} max={0xffffffff} onChange={(value) => update('shutdownTimeDelay', value)} />
          <NumberSetting label="Startup delay (ms)" value={draft.startupTimeDelay} max={0xffffffff} onChange={(value) => update('startupTimeDelay', value)} />
          <Box />
          <Box sx={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: .5, px: .5 }}>
            <FormControlLabel control={<Switch size="small" checked={draft.standalone} onChange={(_, value) => update('standalone', value)} />} label={<Typography sx={{ fontSize: 12 }}>Standalone</Typography>} />
            <FormControlLabel control={<Switch size="small" checked={draft.autoShutdown} onChange={(_, value) => update('autoShutdown', value)} />} label={<Typography sx={{ fontSize: 12 }}>Auto shutdown</Typography>} />
            <FormControlLabel control={<Switch size="small" checked={draft.auxPower} onChange={(_, value) => update('auxPower', value)} />} label={<Typography sx={{ fontSize: 12 }}>Aux power</Typography>} />
            <FormControlLabel control={<Switch size="small" checked={draft.forty8Khz} onChange={(_, value) => update('forty8Khz', value)} />} label={<Typography sx={{ fontSize: 12 }}>48 kHz</Typography>} />
            <FormControlLabel control={<Switch size="small" checked={draft.debug} onChange={(_, value) => update('debug', value)} />} label={<Typography sx={{ fontSize: 12 }}>Debug</Typography>} />
          </Box>
          <Typography sx={{ gridColumn: '1 / -1', mt: .4, p: 1, borderRadius: 1.5, background: 'rgba(255,193,91,.08)', color: '#ffc46b', fontSize: 11 }}>Changing node or group addresses can temporarily disconnect this interface from the MOST network.</Typography>
        </Box> : tab === 'routing' ? <Box sx={{ display: 'grid', gap: 1.2 }}>
          <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>Used by PiMOST firmware when standalone mode is enabled. Values accept decimal or 0x-prefixed hexadecimal.</Typography>
          <RouteEditor title="AMPLIFIER ROUTE" value={draft.amplifier} onChange={(value) => update('amplifier', value)} />
          <RouteEditor title="MICROPHONE ROUTE" value={draft.microphone} onChange={(value) => update('microphone', value)} />
        </Box> : <PiMostFirmware bootToDfu={bootToDfu} />}
      </Box>
    </Box>
  </Box>
}
