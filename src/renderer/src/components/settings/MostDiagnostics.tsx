import { useMemo, useState } from 'react'
import { Box, Button, Chip, MenuItem, Select, TextField, Typography } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { useNavigate } from 'react-router-dom'
import { MostDiagnosticDevice, useMostDiagnosticsStore } from '../../store/store'

const hex = (value: number, width = 2) => `0x${value.toString(16).toUpperCase().padStart(width, '0')}`
const parseHex = (value: string) => Number.parseInt(value.replace(/^0x/i, ''), 16)

export default function MostDiagnostics() {
  const navigate = useNavigate()
  const store = useMostDiagnosticsStore()
  const [deviceFilter, setDeviceFilter] = useState('')
  const [fBlockFilter, setFBlockFilter] = useState('')
  const [selectedFunctions, setSelectedFunctions] = useState<number[]>([])
  const [manual, setManual] = useState({ target: '0161', fblock: 'F0', instance: '01', function: '001', opType: '01', data: '' })

  const messages = useMemo(() => store.messages.filter((message) => {
    const address = message.direction === 'rx' ? message.sourceAddress : message.targetAddress
    return (!deviceFilter || address === parseHex(deviceFilter)) && (!fBlockFilter || message.fBlockID === parseHex(fBlockFilter))
  }), [store.messages, deviceFilter, fBlockFilter])

  const selectDevice = (value: string) => {
    const device = store.registry.find((item) => `${item.address}:${item.fBlockID}:${item.instanceID}` === value)
    if (device) store.selectDevice(device)
  }

  const sendManual = () => store.sendMessage({
    targetAddress: parseHex(manual.target),
    fBlockID: parseHex(manual.fblock),
    instanceID: parseHex(manual.instance),
    fktID: parseHex(manual.function),
    opType: parseHex(manual.opType),
    data: manual.data.trim() ? manual.data.trim().split(/[ ,]+/).map(parseHex) : []
  })

  return <Box sx={{ height: '100%', p: 1, display: 'grid', gridTemplateRows: '42px 52px minmax(0,1fr) 54px', gap: .8, overflow: 'hidden' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box className="settings-back" onClick={() => navigate('/settings')}><ArrowBackRoundedIcon /></Box><Typography sx={{ fontSize: 21, fontWeight: 600 }}>MOST diagnostics</Typography><Chip size="small" label={`${store.subscriptions.length} subscriptions`} /><Button size="small" onClick={store.requestRegistry}>Request registry</Button><Button size="small" onClick={() => store.setLogging(!store.logging)} color={store.logging ? 'error' : 'primary'}>{store.logging ? 'Stop log' : 'Log to file'}</Button><Button size="small" onClick={() => store.setPaused(!store.paused)}>{store.paused ? 'Resume' : 'Pause'}</Button><Button size="small" onClick={store.clearMessages}>Clear</Button></Box>
    <Box className="glass-panel" sx={{ p: .7, borderRadius: 2, display: 'flex', alignItems: 'center', gap: .7 }}>
      <Select size="small" displayEmpty value={store.selectedDevice ? `${store.selectedDevice.address}:${store.selectedDevice.fBlockID}:${store.selectedDevice.instanceID}` : ''} onChange={(event) => selectDevice(event.target.value)} sx={{ minWidth: 180 }}><MenuItem value="" disabled>Select registry device</MenuItem>{store.registry.map((device: MostDiagnosticDevice) => <MenuItem key={`${device.address}:${device.fBlockID}:${device.instanceID}`} value={`${device.address}:${device.fBlockID}:${device.instanceID}`}>{hex(device.address, 4)} · {hex(device.fBlockID)} / {hex(device.instanceID)}</MenuItem>)}</Select>
      <Button size="small" disabled={!store.selectedDevice} onClick={store.subscribeAll}>Subscribe all</Button><Button size="small" disabled={!store.selectedDevice} onClick={store.requestFunctions}>Request functions</Button>
      <Select multiple size="small" value={selectedFunctions} onChange={(event) => setSelectedFunctions(event.target.value as number[])} sx={{ minWidth: 150 }} renderValue={(values) => values.map((value) => hex(value, 3)).join(', ')}>{store.functions.map((fktID) => <MenuItem key={fktID} value={fktID}>{hex(fktID, 3)}</MenuItem>)}</Select>
      <Button size="small" disabled={!selectedFunctions.length} onClick={() => store.subscribeFunctions(selectedFunctions)}>Subscribe selected</Button>
      <TextField size="small" label="Device" value={deviceFilter} onChange={(event) => setDeviceFilter(event.target.value)} sx={{ width: 95 }} /><TextField size="small" label="FBlock" value={fBlockFilter} onChange={(event) => setFBlockFilter(event.target.value)} sx={{ width: 90 }} />
    </Box>
    <Box className="glass-panel" sx={{ minHeight: 0, borderRadius: 2, overflow: 'auto', fontFamily: 'monospace', fontSize: 11 }}>
      {messages.map((message, index) => <Box key={`${message.timestamp}-${index}`} sx={{ px: 1, py: .28, display: 'grid', gridTemplateColumns: '35px 90px 54px 54px 62px 42px minmax(0,1fr)', gap: .8, color: message.direction === 'rx' ? '#67d8ff' : '#ffb547', borderBottom: '1px solid rgba(255,255,255,.035)' }}><b>{message.direction.toUpperCase()}</b><span>{new Date(message.timestamp).toLocaleTimeString()}</span><span>{hex(message.direction === 'rx' ? message.sourceAddress ?? 0 : message.targetAddress ?? 0, 4)}</span><span>{hex(message.fBlockID)}</span><span>{hex(message.fktID, 3)}</span><span>{hex(message.opType)}</span><span>{message.data.map((value) => hex(value).slice(2)).join(' ')}</span></Box>)}
    </Box>
    <Box className="glass-panel" sx={{ p: .6, borderRadius: 2, display: 'flex', gap: .6 }}>
      {([['target', 88], ['fblock', 70], ['instance', 70], ['function', 76], ['opType', 66], ['data', 220]] as const).map(([key, width]) => <TextField key={key} size="small" label={key} value={manual[key]} onChange={(event) => setManual({ ...manual, [key]: event.target.value })} sx={{ width }} />)}<Button variant="contained" onClick={sendManual}>Send</Button>
    </Box>
  </Box>
}
