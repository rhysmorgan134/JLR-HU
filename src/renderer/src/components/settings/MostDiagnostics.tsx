import { Box, Button, Checkbox, Chip, Dialog, DialogContent, MenuItem, TextField, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import PauseRoundedIcon from '@mui/icons-material/PauseRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded'
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded'
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded'
import UsbRoundedIcon from '@mui/icons-material/UsbRounded'
import { MostDiagnosticDevice, useMostDiagnosticsStore } from '../../store/store'

const fBlockNames: Record<number, string> = { 0x01: 'NetBlock', 0x02: 'NetworkMaster', 0x03: 'ConnectionMaster', 0x05: 'Vehicle', 0x06: 'Diagnostics', 0x10: 'HMI', 0x22: 'Amplifier', 0x24: 'Aux input', 0x31: 'Audio disk', 0x40: 'AM/FM tuner', 0x42: 'TV tuner', 0x43: 'DAB tuner', 0x44: 'Satellite', 0x50: 'Telephone', 0x71: 'Climate', 0xf0: 'Audio control' }
const hex = (value: number | undefined, width = 2) => value == null ? '—' : `0x${value.toString(16).toUpperCase().padStart(width, '0')}`
const keyFor = (device: MostDiagnosticDevice) => `${device.address}:${device.fBlockID}:${device.instanceID}`
const parseNumber = (value: string) => Number.parseInt(value.trim(), value.trim().toLowerCase().startsWith('0x') ? 16 : 10)

export default function MostDiagnostics() {
  const navigate = useNavigate()
  const state = useMostDiagnosticsStore()
  const [deviceFilter, setDeviceFilter] = useState('all')
  const [fBlockFilter, setFBlockFilter] = useState('')
  const [sendOpen, setSendOpen] = useState(false)
  const [subscriptionsOpen, setSubscriptionsOpen] = useState(false)
  const [fBlockOpen, setFBlockOpen] = useState(false)
  const [selectedFunctions, setSelectedFunctions] = useState<number[]>([])
  const [sendError, setSendError] = useState('')
  const [form, setForm] = useState({ address: '0x0400', fBlockID: '0x02', instanceID: '0x00', fktID: '0x000', opType: '0x01', data: '' })
  const filteredMessages = useMemo(() => state.messages.filter((message) => {
    const address = message.sourceAddress ?? message.targetAddress
    const matchesDevice = deviceFilter === 'all' || address === Number(deviceFilter)
    const parsedFBlock = fBlockFilter.trim() === '' ? null : parseNumber(fBlockFilter)
    return matchesDevice && (parsedFBlock == null || Number.isNaN(parsedFBlock) || message.fBlockID === parsedFBlock)
  }), [state.messages, deviceFilter, fBlockFilter])
  const visibleMessages = useMemo(() => filteredMessages.slice(-300).reverse(), [filteredMessages])
  const openSender = () => {
    const device = state.selectedDevice
    if (device) setForm((current) => ({ ...current, address: hex(device.address, 4), fBlockID: hex(device.fBlockID), instanceID: hex(device.instanceID) }))
    setSendError('')
    setSendOpen(true)
  }
  const openFBlock = (device: MostDiagnosticDevice) => {
    state.selectDevice(device)
    setSelectedFunctions([])
    setFBlockOpen(true)
  }
  const toggleFunction = (fktID: number) => setSelectedFunctions((current) =>
    current.includes(fktID) ? current.filter((value) => value !== fktID) : [...current, fktID]
  )
  const sendManualMessage = () => {
    const address = parseNumber(form.address)
    const fBlockID = parseNumber(form.fBlockID)
    const instanceID = parseNumber(form.instanceID)
    const fktID = parseNumber(form.fktID)
    const opType = parseNumber(form.opType)
    const data = form.data.trim() === '' ? [] : form.data.trim().split(/[\s,]+/).map((value) => Number.parseInt(value.replace(/^0x/i, ''), 16))
    if ([address, fBlockID, instanceID, fktID, opType, ...data].some(Number.isNaN) || address < 0 || address > 0xffff || [fBlockID, instanceID, opType, ...data].some((value) => value < 0 || value > 0xff) || fktID < 0 || fktID > 0xfff) {
      setSendError('Check the address, IDs, operation type and hex data bytes.')
      return
    }
    state.sendMessage({ targetAddress: address, fBlockID, instanceID, fktID, opType, data })
    setSendOpen(false)
  }
  return <Box sx={{ height: '100%', p: 1, display: 'grid', gridTemplateRows: '46px minmax(0,1fr)', gap: 1 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box className="settings-back" onClick={() => navigate('/settings')}><ArrowBackRoundedIcon /></Box>
      <Box sx={{ mr: 'auto' }}><Typography sx={{ fontSize: 20, fontWeight: 600, lineHeight: 1.05 }}>MOST diagnostics</Typography><Typography sx={{ fontSize: 10, color: 'text.secondary', letterSpacing: 1.1 }}>LIVE NETWORK MONITOR</Typography></Box>
      <Button size="small" color="inherit" startIcon={<ListAltRoundedIcon />} onClick={() => setSubscriptionsOpen(true)}>{state.subscriptions.length} subs</Button>
      <Button size="small" color="inherit" startIcon={<FolderOpenRoundedIcon />} onClick={() => navigate('/settings/most-logs')}>Logs</Button>
      <Button size="small" color="inherit" startIcon={<UsbRoundedIcon />} onClick={() => navigate('/settings/pimost-usb')}>PiMOST USB</Button>
      <Button size="small" color={state.logging ? 'error' : 'inherit'} startIcon={<FiberManualRecordRoundedIcon />} onClick={() => state.setLogging(!state.logging)}>{state.logging ? 'Stop log' : 'Log'}</Button>
      <Button size="small" variant="outlined" startIcon={<SendRoundedIcon />} onClick={openSender}>Send</Button>
      <Button size="small" variant="outlined" startIcon={<RefreshRoundedIcon />} onClick={state.requestRegistry}>Registry</Button>
    </Box>
    <Box sx={{ minHeight: 0, display: 'grid', gridTemplateColumns: '230px minmax(0,1fr)', gap: 1 }}>
      <Box className="glass-panel" sx={{ minHeight: 0, borderRadius: 2.5, display: 'grid', gridTemplateRows: '42px minmax(0,1fr) 50px', overflow: 'hidden' }}>
        <Box sx={{ px: 1.5, display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--stroke)' }}><Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.4, color: 'text.secondary' }}>NETWORK REGISTRY</Typography></Box>
        <Box sx={{ overflowY: 'auto', p: .7 }}>{state.registry.length === 0 ? <Typography sx={{ p: 1, fontSize: 12, color: 'text.secondary' }}>Press Registry to discover MOST devices.</Typography> : state.registry.map((device, index) => {
          const selected = state.selectedDevice && keyFor(state.selectedDevice) === keyFor(device)
          const subscription = state.subscriptions.find((item) => keyFor(item) === keyFor(device))
          const subscriptionColor = subscription?.state === 'active' ? '#65e2a8' : subscription?.state === 'failed' ? '#ff6b7a' : '#f5c76b'
          return <Box key={`${keyFor(device)}:${index}`} onClick={() => openFBlock(device)} sx={{ px: 1.1, py: .75, mb: .45, cursor: 'pointer', borderRadius: 1.5, border: '1px solid', borderColor: selected ? 'primary.main' : 'transparent', background: selected ? 'var(--accent-soft)' : 'rgba(255,255,255,.025)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Typography noWrap sx={{ fontSize: 12.5, fontWeight: 600 }}>{fBlockNames[device.fBlockID] || `FBlock ${hex(device.fBlockID)}`}</Typography>{subscription && <NotificationsActiveRoundedIcon sx={{ fontSize: 14, color: subscriptionColor }} />}</Box>
            <Typography sx={{ fontFamily: 'monospace', fontSize: 10.5, color: 'text.secondary' }}>{hex(device.address, 4)} · inst {hex(device.instanceID)}</Typography>
          </Box>
        })}</Box>
        <Box sx={{ p: .8, borderTop: '1px solid var(--stroke)' }}><Button fullWidth size="small" variant="contained" disabled={!state.selectedDevice} startIcon={<NotificationsActiveRoundedIcon />} onClick={() => setFBlockOpen(true)}>FBlock options</Button></Box>
      </Box>
      <Box className="glass-panel" sx={{ minWidth: 0, minHeight: 0, borderRadius: 2.5, display: 'grid', gridTemplateRows: '42px minmax(0,1fr)', overflow: 'hidden' }}>
        <Box sx={{ px: 1, display: 'flex', alignItems: 'center', gap: .6, borderBottom: '1px solid var(--stroke)' }}><TextField select size="small" value={deviceFilter} onChange={(event) => setDeviceFilter(event.target.value)} sx={{ width: 116, '& .MuiInputBase-root': { height: 30, fontSize: 11 } }}><MenuItem value="all">All devices</MenuItem>{Array.from(new Set(state.registry.map((device) => device.address))).map((address) => <MenuItem key={address} value={String(address)}>{hex(address, 4)}</MenuItem>)}</TextField><TextField size="small" placeholder="FBlock ID" value={fBlockFilter} onChange={(event) => setFBlockFilter(event.target.value)} sx={{ width: 92, '& .MuiInputBase-root': { height: 30, fontSize: 11 } }} /><Typography sx={{ mr: 'auto', fontSize: 10, color: 'text.secondary' }}>{visibleMessages.length < filteredMessages.length ? `${visibleMessages.length} shown · ${filteredMessages.length}` : filteredMessages.length}/{state.messages.length}</Typography><Button size="small" color="inherit" onClick={() => state.setPaused(!state.paused)}>{state.paused ? <PlayArrowRoundedIcon /> : <PauseRoundedIcon />}</Button><Button size="small" color="inherit" onClick={state.clearMessages}><DeleteSweepRoundedIcon /></Button></Box>
        <Box sx={{ overflowY: 'auto', fontFamily: 'monospace', contain: 'strict' }}>{visibleMessages.length === 0 ? <Typography sx={{ p: 2, fontSize: 12, color: 'text.secondary' }}>Waiting for matching MOST traffic…</Typography> : visibleMessages.map((message, index) => <Box key={`${message.timestamp}:${index}`} sx={{ display: 'grid', gridTemplateColumns: '44px 64px 42px 42px 60px 44px minmax(0,1fr)', gap: .6, px: 1.1, py: .62, alignItems: 'center', borderBottom: '1px solid rgba(189,221,255,.055)', fontSize: 10.5, contentVisibility: 'auto', containIntrinsicSize: '28px' }}>
          <Typography component="span" sx={{ fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 700, color: message.direction === 'rx' ? '#65e2a8' : 'primary.main' }}>{message.direction.toUpperCase()}</Typography>
          <Typography component="span" sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'text.secondary' }}>{hex(message.sourceAddress ?? message.targetAddress, 4)}</Typography>
          <Typography component="span" sx={{ fontFamily: 'inherit', fontSize: 'inherit' }}>{hex(message.fBlockID)}</Typography>
          <Typography component="span" sx={{ fontFamily: 'inherit', fontSize: 'inherit' }}>{hex(message.instanceID)}</Typography>
          <Typography component="span" sx={{ fontFamily: 'inherit', fontSize: 'inherit' }}>{hex(message.fktID, 3)}</Typography>
          <Typography component="span" sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'text.secondary' }}>{hex(message.opType)}</Typography>
          <Typography component="span" noWrap sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: message.data.length ? 'text.primary' : 'text.secondary' }}>{message.data.map((byte) => byte.toString(16).toUpperCase().padStart(2, '0')).join(' ') || '—'}</Typography>
        </Box>)}</Box>
      </Box>
    </Box>
    <Dialog open={fBlockOpen} onClose={() => setFBlockOpen(false)} fullWidth maxWidth="sm">
      <DialogContent sx={{ p: 2.2 }}>
        {state.selectedDevice && <>
          <Typography sx={{ fontSize: 20, fontWeight: 600 }}>{fBlockNames[state.selectedDevice.fBlockID] || `FBlock ${hex(state.selectedDevice.fBlockID)}`}</Typography>
          <Typography sx={{ mb: 1.5, fontFamily: 'monospace', fontSize: 11, color: 'text.secondary' }}>{hex(state.selectedDevice.address, 4)} · FB {hex(state.selectedDevice.fBlockID)} · inst {hex(state.selectedDevice.instanceID)}</Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
            <Button variant="contained" startIcon={<NotificationsActiveRoundedIcon />} onClick={state.subscribeAll}>Subscribe all</Button>
            <Button variant="outlined" startIcon={<RefreshRoundedIcon />} onClick={() => state.requestFunctions()}>Request functions</Button>
          </Box>
          {state.functions.length === 0 ?
            <Typography sx={{ p: 1.5, borderRadius: 1.5, background: 'rgba(255,255,255,.035)', color: 'text.secondary', fontSize: 12 }}>Request the FBlock function list to select individual notifications.</Typography> :
            <>
              <Box sx={{ maxHeight: 230, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: .5 }}>
                {state.functions.map((fktID) => {
                  const supported = fktID <= 0xff
                  const checked = selectedFunctions.includes(fktID)
                  return <Box key={fktID} onClick={() => supported && toggleFunction(fktID)} sx={{ px: .5, display: 'flex', alignItems: 'center', borderRadius: 1, cursor: supported ? 'pointer' : 'not-allowed', opacity: supported ? 1 : .4, background: checked ? 'var(--accent-soft)' : 'rgba(255,255,255,.03)' }}><Checkbox size="small" disabled={!supported} checked={checked} /><Typography sx={{ fontFamily: 'monospace', fontSize: 11 }}>{hex(fktID, 3)}</Typography></Box>
                })}
              </Box>
              <Typography sx={{ mt: .7, fontSize: 10, color: 'text.secondary' }}>The current notification protocol accepts one-byte function IDs; wider IDs remain visible but cannot be selected.</Typography>
            </>}
          <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button color="inherit" onClick={() => setFBlockOpen(false)}>Close</Button>
            <Button variant="contained" disabled={selectedFunctions.length === 0} onClick={() => state.subscribeFunctions(selectedFunctions)}>Subscribe selected ({selectedFunctions.length})</Button>
          </Box>
        </>}
      </DialogContent>
    </Dialog>
    <Dialog open={sendOpen} onClose={() => setSendOpen(false)} fullWidth maxWidth="sm"><DialogContent sx={{ p: 2.2 }}><Typography sx={{ fontSize: 20, fontWeight: 600, mb: 1.5 }}>Send MOST message</Typography><Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1 }}>{Object.entries({ address: 'Target address', fBlockID: 'FBlock ID', instanceID: 'Instance ID', fktID: 'Function ID', opType: 'OpType' }).map(([field, label]) => <TextField key={field} size="small" label={label} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} />)}<TextField size="small" label="Data bytes" placeholder="00 FF 1A" value={form.data} onChange={(event) => setForm({ ...form, data: event.target.value })} /></Box>{sendError && <Typography sx={{ mt: 1, color: 'error.main', fontSize: 12 }}>{sendError}</Typography>}<Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}><Button color="inherit" onClick={() => setSendOpen(false)}>Cancel</Button><Button variant="contained" startIcon={<SendRoundedIcon />} onClick={sendManualMessage}>Send</Button></Box></DialogContent></Dialog>
    <Dialog open={subscriptionsOpen} onClose={() => setSubscriptionsOpen(false)} fullWidth maxWidth="sm"><DialogContent sx={{ p: 2.2 }}><Typography sx={{ fontSize: 20, fontWeight: 600 }}>Subscriptions</Typography><Typography sx={{ mb: 1.5, fontSize: 11, color: 'text.secondary' }}>Live state from the shared subscription manager</Typography><Box sx={{ maxHeight: 260, overflowY: 'auto' }}>{state.subscriptions.length === 0 ? <Typography sx={{ color: 'text.secondary' }}>No subscriptions recorded.</Typography> : state.subscriptions.map((subscription, index) => { const color = subscription.state === 'active' ? '#65e2a8' : subscription.state === 'failed' ? '#ff6b7a' : '#f5c76b'; return <Box key={`${keyFor(subscription)}:${subscription.state}:${index}`} sx={{ mb: .7, p: 1.1, borderRadius: 1.5, background: 'rgba(255,255,255,.04)', display: 'flex', alignItems: 'center', gap: 1 }}><NotificationsActiveRoundedIcon sx={{ color, fontSize: 18 }} /><Box sx={{ flex: 1 }}><Typography sx={{ fontSize: 13, fontWeight: 600 }}>{subscription.owner}</Typography><Typography sx={{ fontFamily: 'monospace', fontSize: 10.5, color: 'text.secondary' }}>{hex(subscription.address, 4)} · FB {hex(subscription.fBlockID)} · inst {hex(subscription.instanceID)}</Typography></Box><Chip size="small" sx={{ color }} label={subscription.state.toUpperCase()} /><Chip size="small" label={subscription.all ? 'ALL' : subscription.functions.map((value) => hex(value, 3)).join(' ')} /></Box> })}</Box>{state.logPath && <Typography sx={{ mt: 1.5, fontSize: 10.5, color: 'text.secondary' }}>Latest log: {state.logPath}</Typography>}<Box sx={{ mt: 1.5, textAlign: 'right' }}><Button onClick={() => setSubscriptionsOpen(false)}>Close</Button></Box></DialogContent></Dialog>
  </Box>
}
