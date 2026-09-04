import { useEffect, useState } from 'react'
import { Box, Dialog, DialogContent, IconButton, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AppsRoundedIcon from '@mui/icons-material/AppsRounded'
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import AudioDiskOverview from './components/mediaComponents/AudioDiskPlayer/AudioDiskOverview'
import AmFmOverview from './components/mediaComponents/AmFm/AmFmOverview'
import CarplayOverview from './components/mediaComponents/CarplayOverview'
import SourceSelection from './components/SourceSelection'
import { useAudioControlStore, useNetworkMasterStore, usePersistantStore } from './store/store'

function Base() {
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const [setSource, currentSource] = useAudioControlStore((state) => [state.setSource, state.currentSource])
  const currentAudioSource = usePersistantStore((state) => state.currentSource)
  const navigate = useNavigate()
  const networkState = useNetworkMasterStore((state) => state.configurationState)
  const networkReady = networkState === 'ok' || networkState === 'new'

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
        <IconButton sx={{ width: 42, height: 42, color: 'text.secondary' }}><SettingsRoundedIcon /></IconButton>
      </Box>
    </Box>

    <Box sx={{ minWidth: 0, display: 'grid', gridTemplateRows: 'minmax(0,1fr) 142px', gap: 1.5 }}>
      <Box className="glass-panel" sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', p: 2.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 76% 52%,rgba(53,183,255,.18),transparent 30%)', pointerEvents: 'none' }} />
        <Box><Typography sx={{ color: 'primary.main', fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>WELCOME</Typography><Typography sx={{ mt: .4, fontSize: 30, fontWeight: 300, letterSpacing: -.6 }}>Your drive, connected.</Typography></Box>
        <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between' }}>
          <Box><Typography sx={{ fontSize: 13, color: 'text.secondary' }}>System status</Typography><Typography sx={{ mt: .4, fontSize: 17, fontWeight: 600, color: networkReady ? '#65e2a8' : 'text.secondary' }}>{networkState === 'unknown' ? 'Waiting for MOST network' : networkReady ? 'MOST network ready' : 'MOST network unavailable'}</Typography></Box>
          <Box sx={{ width: 120, height: 54, display: 'flex', alignItems: 'end', gap: .5, opacity: .75 }}>{[14,24,33,19,42,31,47,26,37,18,29,13].map((h,i)=><Box key={i} sx={{ flex: 1, height: h, borderRadius: 2, background: i > 7 ? 'primary.main' : 'rgba(103,216,255,.26)' }} />)}</Box>
        </Box>
      </Box>

      <Box sx={{ minHeight: 0 }}>
        <Box className="glass-panel touch-card" onClick={openCurrentSource} sx={{ borderRadius: 3, overflow: 'hidden', cursor: 'pointer', position: 'relative' }}>
          {sourceOverview}<ChevronRightRoundedIcon sx={{ position: 'absolute', right: 12, top: 12, color: 'text.secondary' }} />
        </Box>
      </Box>
    </Box>

    <Dialog open={sourcesOpen} onClose={() => setSourcesOpen(false)} fullWidth maxWidth="sm"><DialogContent sx={{ p: 2.5 }}><Typography sx={{ mb: 2, fontSize: 22, fontWeight: 600 }}>Choose a source</Typography><SourceSelection onSelect={() => setSourcesOpen(false)} /></DialogContent></Dialog>
  </Box>
}
export default Base
