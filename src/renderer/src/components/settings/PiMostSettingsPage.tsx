import { ChangeEvent, useEffect, useState } from 'react'
import { Alert, Box, Button, LinearProgress, Typography } from '@mui/material'
import SettingsPage from './SettingsPage'
import MostSettings from './MostSettings'
import { useMostSettings } from '../../store/store'
import { socket } from '../../store/store'

export default function PiMostSettingsPage() {
  const [tab, setTab] = useState<'settings' | 'firmware'>('settings')
  const [firmware, setFirmware] = useState<File | null>(null)
  const [firmwareStatus, setFirmwareStatus] = useState('Ready')
  const [progress, setProgress] = useState<number | null>(null)
  const settings = useMostSettings()
  const [actualSettings, setActualSettings] = useState({
    usb: settings.usb,
    manualIp: settings.manualIp,
    ip: settings.ip,
    usbSettings: settings.usbSettings
  })
  useEffect(() => setActualSettings({
    usb: settings.usb,
    manualIp: settings.manualIp,
    ip: settings.ip,
    usbSettings: settings.usbSettings
  }), [settings.usb, settings.manualIp, settings.ip, settings.usbSettings])
  useEffect(() => { settings.requestSettings() }, [])
  useEffect(() => {
    const listener = (value: { percent?: number; message: string }) => { setProgress(value.percent ?? null); setFirmwareStatus(value.message) }
    socket.on('piMostFirmware:progress', listener)
    return () => { socket.off('piMostFirmware:progress', listener) }
  }, [])
  const selectFirmware = (event: ChangeEvent<HTMLInputElement>) => setFirmware(event.target.files?.[0] || null)
  const flash = async () => {
    if (!firmware) return
    setFirmwareStatus('Uploading firmware…')
    socket.emit('piMostFirmware:flash', { name: firmware.name, data: await firmware.arrayBuffer() }, (result: { ok: boolean; message: string }) => setFirmwareStatus(result.message))
  }
  return <SettingsPage title="PiMOST USB">
    <Box sx={{ height: '100%', display: 'grid', gridTemplateRows: '36px minmax(0,1fr)', gap: 1 }}>
      <Box sx={{ display: 'flex', gap: 1 }}><Button size="small" variant={tab === 'settings' ? 'contained' : 'outlined'} onClick={() => setTab('settings')}>Configuration</Button><Button size="small" variant={tab === 'firmware' ? 'contained' : 'outlined'} onClick={() => setTab('firmware')}>Firmware</Button></Box>
      <Box sx={{ minHeight: 0, overflow: 'hidden' }}>{tab === 'settings' ? <MostSettings actualSettings={actualSettings} setActualSettings={setActualSettings} /> : <Box sx={{ height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.2 }}><Box className="glass-panel" sx={{ borderRadius: 2.5, p: 1.5 }}><Typography sx={{ fontWeight: 700 }}>Enter DFU mode</Typography><Typography sx={{ my: 1, fontSize: 12, color: 'text.secondary' }}>Ask the connected PiMOST interface to reboot into its firmware bootloader.</Typography><Button variant="outlined" onClick={() => socket.emit('piMostFirmware:bootToDfu')}>Boot to DFU</Button></Box><Box className="glass-panel" sx={{ borderRadius: 2.5, p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}><Typography sx={{ fontWeight: 700 }}>Install firmware image</Typography><Button component="label" variant="outlined">{firmware?.name || 'Choose firmware'}<input hidden type="file" accept=".bin,.dfu" onChange={selectFirmware} /></Button>{progress != null && <LinearProgress variant="determinate" value={progress} />}<Alert severity="info" sx={{ fontSize: 11 }}>{firmwareStatus}</Alert><Button sx={{ mt: 'auto' }} variant="contained" disabled={!firmware} onClick={flash}>Flash firmware</Button></Box></Box>}</Box>
    </Box>
  </SettingsPage>
}
