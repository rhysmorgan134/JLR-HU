import { useMemo, useState } from 'react'
import { Box, Button, Chip, Dialog, DialogContent, FormControlLabel, IconButton, LinearProgress, Switch, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import GraphicEqRoundedIcon from '@mui/icons-material/GraphicEqRounded'
import RadioRoundedIcon from '@mui/icons-material/RadioRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import { useNavigate } from 'react-router-dom'
import { DabRecord, useDabTunerStore } from '../../../store/store'

type View = 'stations' | 'presets' | 'ensembles'

const ptyCategories = [
  ['News', 0x01], ['Current affairs', 0x02], ['Information', 0x03], ['Sport', 0x04],
  ['Education', 0x05], ['Drama', 0x06], ['Culture', 0x07], ['Science', 0x08],
  ['Varied', 0x09], ['Pop music', 0x0a], ['Rock music', 0x0b], ['Easy listening', 0x0c],
  ['Light classical', 0x0d], ['Classical', 0x0e], ['Other music', 0x0f], ['Weather', 0x10],
  ['Finance', 0x11], ['Children', 0x12], ['Social affairs', 0x13], ['Religion', 0x14],
  ['Phone-in', 0x15], ['Travel', 0x16], ['Leisure', 0x17], ['Jazz', 0x18],
  ['Country', 0x19], ['National music', 0x1a], ['Oldies', 0x1b], ['Folk', 0x1c],
  ['Documentary', 0x1d]
] as const

function uniqueNamed(records: Record<string, DabRecord>): DabRecord[] {
  const names = new Set<string>()
  return Object.values(records).sort((left, right) => left.index - right.index).filter((record) => {
    const name = record.name?.trim()
    if (!name || names.has(name)) return false
    names.add(name)
    return true
  })
}

export default function DabTunerPage() {
  const navigate = useNavigate()
  const state = useDabTunerStore()
  const [view, setView] = useState<View>('presets')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [ptyOpen, setPtyOpen] = useState(false)
  const [traffic, setTraffic] = useState(false)
  const [warning, setWarning] = useState(false)
  const services = useMemo(() => uniqueNamed(state.services), [state.services])
  const ensembles = useMemo(() => uniqueNamed(state.ensembles), [state.ensembles])
  const presets = useMemo(() => Object.values(state.presets)
    .filter((item) => item.name && (item.bank ?? 1) === 1)
    .sort((left, right) => (left.preset ?? 0) - (right.preset ?? 0)), [state.presets])
  const station = state.serviceSelectionPending
    ? 'Tuning…'
    : state.serviceSelectionError
      ? 'Unable to tune'
      : state.currentServiceName || state.selectedService || 'No service selected'
  const stationDetail = state.serviceSelectionPending
    ? state.pendingServiceName ? `Searching for ${state.pendingServiceName}` : 'Searching for service'
    : state.serviceSelectionError
      ? 'The selected service is unavailable'
      : state.radioText || ensembles.map((item) => item.name).slice(0, 2).join(' · ') || 'Digital radio'
  const available = view === 'stations' ? services : view === 'presets' ? presets : ensembles
  const windowOffset = view === 'stations' ? state.serviceWindowOffset : view === 'ensembles' ? state.ensembleWindowOffset : 0
  const visible = available.slice(windowOffset, windowOffset + 10)

  const changeView = (nextView: View) => {
    setView(nextView)
    if (nextView === 'stations') state.requestFullServiceList()
    if (nextView === 'ensembles') state.requestEnsembleList()
  }

  const choose = (record: DabRecord, index: number) => {
    if (view === 'stations') state.selectService(record)
    else if (view === 'presets') state.selectPreset(record.preset || index + 1)
    else if (record.ensembleId) {
      state.requestEnsembleServices(record.ensembleId)
      setView('stations')
    }
  }

  return <Box sx={{ height: '100%', p: 1.25, display: 'grid', gridTemplateRows: '46px minmax(0,1fr)', gap: 1, overflow: 'hidden' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton onClick={() => navigate('/home')} sx={{ width: 42, height: 42, color: 'white', background: 'rgba(255,255,255,.06)' }}><ArrowBackRoundedIcon /></IconButton>
      <Box sx={{ mr: 'auto' }}><Typography sx={{ fontSize: 10, color: 'primary.main', fontWeight: 700, letterSpacing: 1.7 }}>DIGITAL ENTERTAINMENT</Typography><Typography sx={{ fontSize: 21, fontWeight: 500, lineHeight: 1 }}>DAB Radio</Typography></Box>
      <ToggleButtonGroup exclusive value={view} onChange={(_, value: View | null) => value && changeView(value)} sx={{ height: 38, border: '1px solid var(--stroke)', borderRadius: 2, '& .MuiToggleButton-root': { px: 1.5, border: 0, color: 'text.secondary', fontSize: 11, fontWeight: 700 }, '& .Mui-selected': { color: '#fff!important', background: 'var(--accent-soft)!important' } }}><ToggleButton value="stations">Channels</ToggleButton><ToggleButton value="presets">Presets</ToggleButton><ToggleButton value="ensembles">Ensembles</ToggleButton></ToggleButtonGroup>
      <IconButton onClick={() => setSettingsOpen(true)} sx={{ width: 40, height: 40, border: '1px solid var(--stroke)', color: 'primary.main' }}><SettingsRoundedIcon /></IconButton>
    </Box>

    <Box sx={{ minHeight: 0, display: 'grid', gridTemplateColumns: 'minmax(270px,.72fr) minmax(0,1.28fr)', gap: 1 }}>
      <Box className="glass-panel" sx={{ borderRadius: 3, p: 2, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 88% 12%,rgba(48,196,255,.25),transparent 38%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><Box sx={{ display: 'flex', alignItems: 'center', gap: .8 }}><RadioRoundedIcon sx={{ color: 'primary.main', fontSize: 18 }} /><Typography sx={{ fontSize: 10.5, color: 'text.secondary', letterSpacing: 1.6 }}>DAB · DIGITAL</Typography></Box><Chip size="small" label={state.frequencyTable === 4 ? 'CANADA L' : 'UK'} sx={{ height: 24, fontSize: 10, background: 'rgba(255,255,255,.06)', color: 'text.secondary' }} /></Box>
        <Box sx={{ position: 'relative' }}><Typography noWrap sx={{ fontSize: 34, fontWeight: 250, letterSpacing: -1.2 }}>{station}</Typography><Typography noWrap sx={{ mt: .5, fontSize: 14, color: 'text.secondary' }}>{stationDetail}</Typography>{state.serviceSelectionPending && <LinearProgress sx={{ mt: 1.2, height: 4, borderRadius: 4 }} />}</Box>
        <Box sx={{ position: 'relative' }}>{state.scanning ? <><Box sx={{ display: 'flex', justifyContent: 'space-between', mb: .7 }}><Typography sx={{ fontSize: 10.5, color: 'text.secondary', letterSpacing: 1 }}>AUTO TUNING</Typography><Typography sx={{ fontSize: 12, color: 'primary.main' }}>{state.scanProgress ?? 0}%</Typography></Box><LinearProgress variant="determinate" value={state.scanProgress ?? 0} sx={{ height: 7, mb: 1, borderRadius: 5, background: 'rgba(255,255,255,.07)' }} /><Button fullWidth size="small" color="inherit" startIcon={<CloseRoundedIcon />} onClick={state.cancelAutoTune} sx={{ border: '1px solid var(--stroke)', color: 'text.secondary' }}>Cancel scan</Button></> : <Button fullWidth startIcon={<TuneRoundedIcon />} onClick={state.startAutoTune} sx={{ height: 44, color: '#041018', fontWeight: 700, background: 'linear-gradient(135deg,#8be4ff,#40c4ff)' }}>Auto tune</Button>}</Box>
      </Box>

      <Box className="glass-panel" sx={{ borderRadius: 3, p: 1.25, minHeight: 0, display: 'grid', gridTemplateRows: '27px minmax(0,1fr)', gap: .6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><Typography sx={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 1.4 }}>{view === 'stations' ? 'AVAILABLE CHANNELS' : view === 'presets' ? 'DAB PRESETS' : 'ENSEMBLES'}</Typography><Box sx={{ display: 'flex', gap: .35, alignItems: 'center' }}>{view !== 'presets' && <><IconButton size="small" onClick={() => view === 'stations' ? state.moveServiceWindow('up') : state.moveEnsembleWindow('up')} sx={{ width: 26, height: 26, border: '1px solid var(--stroke)' }}><KeyboardArrowUpRoundedIcon fontSize="small" /></IconButton><IconButton size="small" onClick={() => view === 'stations' ? state.moveServiceWindow('down') : state.moveEnsembleWindow('down')} sx={{ width: 26, height: 26, border: '1px solid var(--stroke)' }}><KeyboardArrowDownRoundedIcon fontSize="small" /></IconButton></>}{view === 'stations' && <><Button size="small" onClick={state.requestFullServiceList} sx={{ minHeight: 25, py: 0, px: .7, fontSize: 9.5 }}>All</Button><Button size="small" onClick={() => setPtyOpen(true)} sx={{ minHeight: 25, py: 0, px: .7, fontSize: 9.5 }}>Categories</Button></>}<Typography sx={{ alignSelf: 'center', fontSize: 9.5, color: 'text.secondary' }}>{visible.length} FOUND</Typography></Box></Box>
        <Box sx={{ minHeight: 0, display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gridTemplateRows: 'repeat(5,minmax(0,1fr))', gap: .6, overflow: 'hidden' }}>{visible.map((record, index) => { const selected = view === 'stations' ? state.selectedService === record.name : view === 'presets' && state.selectedPreset === (record.preset || index + 1); return <Box key={`${view}:${record.index}:${record.name}`} className="touch-card" onClick={() => choose(record, index)} sx={{ minWidth: 0, px: 1, borderRadius: 1.7, cursor: 'pointer', border: selected ? '1px solid rgba(103,216,255,.75)' : '1px solid var(--stroke)', background: selected ? 'linear-gradient(145deg,rgba(38,174,235,.3),rgba(22,58,80,.5))' : 'rgba(255,255,255,.035)', display: 'flex', alignItems: 'center', gap: .8 }}><Typography sx={{ width: 20, fontSize: 16, fontWeight: 300, color: selected ? 'primary.main' : 'text.secondary' }}>{view === 'presets' ? record.preset || index + 1 : record.index}</Typography><Box sx={{ minWidth: 0 }}><Typography noWrap sx={{ fontSize: 12, fontWeight: 600 }}>{record.name}</Typography>{view === 'ensembles' && <Typography sx={{ fontSize: 9.5, color: 'text.secondary' }}>Open ensemble</Typography>}</Box></Box> })}</Box>
      </Box>
    </Box>

    <Dialog open={ptyOpen} onClose={() => setPtyOpen(false)} fullWidth maxWidth="md"><DialogContent sx={{ p: 1.7 }}><Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}><Box><Typography sx={{ fontSize: 10, color: 'primary.main', fontWeight: 700, letterSpacing: 1.5 }}>PROGRAMME TYPE</Typography><Typography sx={{ fontSize: 21, fontWeight: 600 }}>Choose a category</Typography></Box><IconButton onClick={() => setPtyOpen(false)} sx={{ ml: 'auto' }}><CloseRoundedIcon /></IconButton></Box><Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: .55 }}>{ptyCategories.map(([label, code]) => <Button key={code} onClick={() => { state.requestPtyServices(code); setView('stations'); setPtyOpen(false); setSettingsOpen(false) }} sx={{ minHeight: 35, px: .7, border: '1px solid var(--stroke)', background: 'rgba(255,255,255,.035)', color: 'text.primary', fontSize: 10.5 }}>{label}</Button>)}</Box></DialogContent></Dialog>

    <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} fullWidth maxWidth="sm"><DialogContent sx={{ p: 2.2 }}><Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}><Box><Typography sx={{ fontSize: 11, color: 'primary.main', fontWeight: 700, letterSpacing: 1.5 }}>DAB</Typography><Typography sx={{ fontSize: 23, fontWeight: 600 }}>Radio settings</Typography></Box><IconButton onClick={() => setSettingsOpen(false)} sx={{ ml: 'auto' }}><CloseRoundedIcon /></IconButton></Box><Typography sx={{ mb: .7, fontSize: 11, color: 'text.secondary', letterSpacing: 1.2 }}>COUNTRY / BAND PLAN</Typography><Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1.5 }}><Button onClick={() => state.setCountry(0x01)} sx={{ p: 1.2, display: 'block', textAlign: 'left', border: state.frequencyTable === 1 ? '1px solid rgba(103,216,255,.7)' : '1px solid var(--stroke)', background: state.frequencyTable === 1 ? 'var(--accent-soft)' : 'rgba(255,255,255,.03)' }}><Typography sx={{ color: 'text.primary', fontWeight: 700 }}>UK</Typography><Typography sx={{ color: 'text.secondary', fontSize: 11 }}>Band III · L Band · rescans</Typography></Button><Button onClick={() => state.setCountry(0x04)} sx={{ p: 1.2, display: 'block', textAlign: 'left', border: state.frequencyTable === 4 ? '1px solid rgba(103,216,255,.7)' : '1px solid var(--stroke)', background: state.frequencyTable === 4 ? 'var(--accent-soft)' : 'rgba(255,255,255,.03)' }}><Typography sx={{ color: 'text.primary', fontWeight: 700 }}>Canada</Typography><Typography sx={{ color: 'text.secondary', fontSize: 11 }}>L Band · rescans</Typography></Button></Box><Typography sx={{ mb: .4, fontSize: 11, color: 'text.secondary', letterSpacing: 1.2 }}>ANNOUNCEMENTS</Typography><Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}><FormControlLabel control={<Switch checked={traffic} onChange={(_, enabled) => { setTraffic(enabled); state.setAnnouncement(0x02, enabled) }} />} label="Traffic" /><FormControlLabel control={<Switch checked={warning} onChange={(_, enabled) => { setWarning(enabled); state.setAnnouncement(0x0a, enabled) }} />} label="Warnings" /><FormControlLabel control={<Switch checked={!!state.fmTraffic} onChange={(_, enabled) => state.setFmTraffic(enabled)} />} label="FM traffic" /></Box><Box sx={{ mt: 1.2, display: 'flex', gap: 1 }}><Button fullWidth variant="outlined" onClick={() => setPtyOpen(true)}>Programme type</Button><Button fullWidth variant="outlined" onClick={() => { state.requestFullServiceList(); setView('stations'); setSettingsOpen(false) }}>Full station list</Button></Box></DialogContent></Dialog>
  </Box>
}
