import { useEffect, useState } from 'react'
import { Box, Dialog, DialogContent, IconButton, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AppsRoundedIcon from '@mui/icons-material/AppsRounded'
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import ThermostatRoundedIcon from '@mui/icons-material/ThermostatRounded'
import LocalParkingRoundedIcon from '@mui/icons-material/LocalParkingRounded'
import AudioDiskOverview from './components/mediaComponents/AudioDiskPlayer/AudioDiskOverview'
import AmFmOverview from './components/mediaComponents/AmFm/AmFmOverview'
import CarplayOverview from './components/mediaComponents/CarplayOverview'
import SourceSelection from './components/SourceSelection'
import { useAudioControlStore, useCanGatewayStore, useClimateStore, useParkingAssistStore, usePersistantStore } from './store/store'

function Base() {
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const [setSource, currentSource] = useAudioControlStore((state) => [state.setSource, state.currentSource])
  const currentAudioSource = usePersistantStore((state) => state.currentSource)
  const navigate = useNavigate()
  const climate = useClimateStore()
  const trip = useCanGatewayStore()
  const openParkingAssist = useParkingAssistStore((state) => state.setManualOpen)

  useEffect(() => { if (currentSource === null && currentAudioSource !== null) setSource(currentAudioSource) }, [])

  const openCurrentSource = () => {
    if (currentSource === 'AudioDiskPlayer') navigate('/AudioDiskPlayer')
    if (currentSource === 'AmFmTuner') navigate('/AmFmTuner')
    if (currentSource === 'Carplay') navigate('/carplay')
  }

  const sourceOverview = currentSource === 'AudioDiskPlayer' ? <AudioDiskOverview /> : currentSource === 'AmFmTuner' ? <AmFmOverview /> : currentSource === 'Carplay' ? <CarplayOverview /> : <Box sx={{ height: '100%', display: 'grid', placeItems: 'center', color: 'text.secondary' }}><Typography>Select an audio source</Typography></Box>

  return <Box sx={{ height: '100%', p: 1.5, display: 'grid', gridTemplateColumns: '58px minmax(0,1fr)', gap: 1.5, overflow: 'hidden' }}>
    <Box className="glass-panel" sx={{ borderRadius: 3, py: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
      <IconButton onClick={() => setSourcesOpen(true)} sx={{ width: 44, height: 44, color: 'primary.main', background: 'var(--accent-soft)' }}><AppsRoundedIcon /></IconButton>
      <Box sx={{ display: 'grid', gap: 1 }}>
        <IconButton sx={{ width: 42, height: 42, color: 'white', background: 'rgba(255,255,255,.06)' }}><MusicNoteRoundedIcon /></IconButton>
        <IconButton aria-label="Open parking assist" onClick={() => openParkingAssist(true)} sx={{ width: 42, height: 42, color: 'text.secondary' }}><LocalParkingRoundedIcon /></IconButton>
        <IconButton onClick={() => navigate('/climate')} sx={{ width: 42, height: 42, color: 'text.secondary' }}><DirectionsCarRoundedIcon /></IconButton>
        <IconButton onClick={() => navigate('/settings')} sx={{ width: 42, height: 42, color: 'text.secondary' }}><SettingsRoundedIcon /></IconButton>
      </Box>
    </Box>

    <Box sx={{ minWidth: 0, display: 'grid', gridTemplateRows: 'minmax(0,1fr) 142px', gap: 1.5 }}>
      <Box className="glass-panel" sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', p: 2.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 76% 52%,rgba(53,183,255,.18),transparent 30%)', pointerEvents: 'none' }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}><Box><Typography sx={{ color: 'primary.main', fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>TRIP COMPUTER</Typography><Typography sx={{ mt: .4, fontSize: 30, fontWeight: 300, letterSpacing: -.6 }}>Journey at a glance.</Typography></Box><ToggleButtonGroup exclusive size="small" value={trip.tripMode} onChange={(_, mode) => mode !== null && trip.setTripMode(mode)} sx={{ '& .MuiToggleButton-root': { minWidth: 54, px: 1.4, py: .65, color: 'text.secondary', borderColor: 'rgba(255,255,255,.12)', fontSize: 11, fontWeight: 700 }, '& .Mui-selected': { color: 'primary.main !important', background: 'var(--accent-soft) !important' } }}><ToggleButton value={1}>Trip A</ToggleButton><ToggleButton value={2}>Trip B</ToggleButton><ToggleButton value={3}>Auto</ToggleButton></ToggleButtonGroup></Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 1.2 }}>
          {[['Average', trip.avgMpg, 'mpg'], ['Range', trip.range, 'mi'], ['Distance', trip.distance, 'mi'], ['Avg speed', trip.avgSpeed, 'mph']].map(([label,value,unit]) => <Box key={label as string} sx={{ borderLeft: '2px solid rgba(103,216,255,.35)', pl: 1.2 }}><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{label}</Typography><Typography sx={{ mt: .2, fontSize: 23, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{value == null ? '—' : Number(value).toFixed(unit === 'mpg' || unit === 'mph' ? 1 : 0)} <Typography component="span" sx={{ fontSize: 11, color: 'text.secondary' }}>{unit}</Typography></Typography></Box>)}
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) minmax(220px,.7fr)', gap: 1.5, minHeight: 0 }}>
        <Box className="glass-panel touch-card" onClick={openCurrentSource} sx={{ borderRadius: 3, overflow: 'hidden', cursor: 'pointer', position: 'relative' }}>
          {sourceOverview}<ChevronRightRoundedIcon sx={{ position: 'absolute', right: 12, top: 12, color: 'text.secondary' }} />
        </Box>
        <Box className="glass-panel touch-card" onClick={() => navigate('/climate')} sx={{ borderRadius: 3, px: 2, display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
          <Box sx={{ width: 46, height: 46, borderRadius: '50%', display: 'grid', placeItems: 'center', color: climate.ac ? 'primary.main' : 'text.secondary', background: climate.ac ? 'var(--accent-soft)' : 'rgba(255,255,255,.05)' }}><ThermostatRoundedIcon /></Box>
          <Box sx={{ minWidth: 0 }}><Typography sx={{ fontSize: 11, color: 'text.secondary', letterSpacing: 1.4 }}>CLIMATE</Typography><Typography sx={{ fontSize: 18, fontWeight: 600 }}>{climate.leftTemp == null ? '—' : climate.leftTemp.toFixed(1)}° <Typography component="span" sx={{ color: 'text.secondary', fontSize: 16 }}>/</Typography> {climate.rightTemp == null ? '—' : climate.rightTemp.toFixed(1)}°</Typography><Typography noWrap sx={{ fontSize: 12, color: 'text.secondary' }}>{climate.auto ? 'Auto' : `Fan ${climate.fanSpeed}`} · A/C {climate.ac ? 'on' : 'off'}</Typography></Box>
        </Box>
      </Box>
    </Box>

    <Dialog open={sourcesOpen} onClose={() => setSourcesOpen(false)} fullWidth maxWidth="sm"><DialogContent sx={{ p: 2.5 }}><Typography sx={{ mb: 2, fontSize: 22, fontWeight: 600 }}>Choose a source</Typography><SourceSelection onSelect={() => setSourcesOpen(false)} /></DialogContent></Dialog>
  </Box>
}
export default Base
