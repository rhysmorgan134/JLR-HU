import { Box, IconButton, LinearProgress, Typography } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import AlbumRoundedIcon from '@mui/icons-material/AlbumRounded'
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded'
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import PauseRoundedIcon from '@mui/icons-material/PauseRounded'
import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded'
import RepeatRoundedIcon from '@mui/icons-material/RepeatRounded'
import GraphicEqRoundedIcon from '@mui/icons-material/GraphicEqRounded'
import { useNavigate } from 'react-router-dom'
import { DeckStatus, Random, Repeat } from '../../../../../main/newPiMost/types'
import { useAudioDiskPlayer } from '../../../store/store'

const formatTime = (milliseconds: number | null) => {
  if (!milliseconds) return '00:00'
  const seconds = Math.floor(milliseconds / 1000)
  return `${Math.floor(seconds / 60).toString().padStart(2,'0')}:${(seconds % 60).toString().padStart(2,'0')}`
}

const enumLabel = (value: unknown, values: object, fallback: string) => {
  if (typeof value === 'string') return value
  if (typeof value === 'number') {
    const label = values[value]
    if (typeof label === 'string') return label
  }
  return fallback
}

export default function AudioDiskplayer() {
  const navigate = useNavigate()
  const state = useAudioDiskPlayer()
  const discs = [state.disk1,state.disk2,state.disk3,state.disk4,state.disk5,state.disk6]
  const activeDisc = state.activeDisk ? discs[state.activeDisk - 1] : null
  const deckLabel = enumLabel(state.deckStatus, DeckStatus, 'Stop')
  const randomLabel = enumLabel(state.random, Random, 'Off')
  const repeatLabel = enumLabel(state.repeat, Repeat, 'Off')
  const playing = deckLabel === 'Play'
  const progress = state.trackTime && state.audioTime ? Math.min(100,(state.audioTime * 100) / state.trackTime) : 0
  const cycleRandom = () => state.setRandom(randomLabel === 'Off' ? Random.Disk : Random.Off)
  const cycleRepeat = () => state.setRepeat(repeatLabel === 'Off' ? Repeat.Track : repeatLabel === 'Track' ? Repeat.Disk : Repeat.Off)

  return <Box sx={{ height: '100%', p: 1.5, display: 'grid', gridTemplateRows: '46px minmax(0,1fr)', gap: 1.25, overflow: 'hidden' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}><IconButton onClick={() => navigate('/home')} sx={{ width: 42, height: 42, color: 'white', background: 'rgba(255,255,255,.06)' }}><ArrowBackRoundedIcon /></IconButton><Box><Typography sx={{ fontSize: 11, color: 'primary.main', fontWeight: 700, letterSpacing: 1.7 }}>ENTERTAINMENT</Typography><Typography sx={{ fontSize: 22, fontWeight: 500, lineHeight: 1 }}>CD Player</Typography></Box><Box sx={{ ml: 'auto', display: 'flex', gap: .7 }}>{discs.map((disc,i)=><Box key={i} onClick={() => disc && state.setActiveDisk(i+1)} sx={{ width: 42, height: 38, borderRadius: 1.5, cursor: disc ? 'pointer' : 'default', opacity: disc || state.activeDisk===i+1 ? 1 : .62, border: state.activeDisk===i+1 ? '1px solid rgba(103,216,255,.75)' : '1px solid var(--stroke)', background: state.activeDisk===i+1 ? 'var(--accent-soft)' : 'rgba(255,255,255,.025)', display: 'grid', placeItems: 'center' }}><Typography sx={{ fontSize: 12, fontWeight: 700, color: state.activeDisk===i+1 ? 'primary.main' : disc ? 'white' : 'text.secondary' }}>{i+1}</Typography></Box>)}</Box></Box>

    <Box sx={{ minHeight: 0, display: 'grid', gridTemplateColumns: 'minmax(270px,.72fr) minmax(0,1.28fr)', gap: 1.25 }}>
      <Box className="glass-panel" sx={{ borderRadius: 3, display: 'grid', placeItems: 'center', position: 'relative', overflow: 'hidden' }}><Box sx={{ position: 'absolute', width: 260, height: 260, border: '1px solid rgba(103,216,255,.12)', borderRadius: '50%', boxShadow: '0 0 70px rgba(34,177,244,.12),inset 0 0 50px rgba(34,177,244,.06)' }} /><Box sx={{ width: 174, height: 174, borderRadius: '50%', background: 'conic-gradient(from 20deg,#202d3d,#8ba4b8,#152131,#637b91,#202d3d)', p: '2px', boxShadow: '0 22px 35px rgba(0,0,0,.45)', display: 'grid', placeItems: 'center' }}><Box sx={{ width: '100%', height: '100%', borderRadius: '50%', background: 'radial-gradient(circle,#0a111a 0 12%,rgba(100,215,255,.35) 13% 15%,#172433 16% 34%,transparent 35%)', display: 'grid', placeItems: 'center' }}><AlbumRoundedIcon sx={{ color: 'rgba(255,255,255,.8)', fontSize: 34 }} /></Box></Box></Box>

      <Box className="glass-panel" sx={{ borderRadius: 3, p: 2.25, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><GraphicEqRoundedIcon sx={{ color: 'primary.main', fontSize: 18 }} /><Typography sx={{ fontSize: 11, color: 'text.secondary', letterSpacing: 1.5 }}>DISC {state.activeDisk ?? '—'} · {deckLabel.toUpperCase()}</Typography></Box><Typography noWrap sx={{ mt: 2.2, fontSize: 30, fontWeight: 500, letterSpacing: -.5 }}>{state.trackTitle?.trim() || (state.trackNo ? `Track ${state.trackNo}` : 'No track information')}</Typography><Typography noWrap sx={{ mt: .5, fontSize: 15, color: 'text.secondary' }}>{activeDisc?.title ? `Album ${activeDisc.title}` : 'Compact Disc'}{state.trackNo ? `  ·  Track ${state.trackNo}${activeDisc?.lastTrack ? ` of ${activeDisc.lastTrack}` : ''}` : ''}</Typography></Box>
        <Box><Box sx={{ display: 'flex', justifyContent: 'space-between', mb: .7 }}><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{formatTime(state.audioTime)}</Typography><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{formatTime(state.trackTime)}</Typography></Box><LinearProgress variant="determinate" value={progress} sx={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,.08)', '& .MuiLinearProgress-bar': { borderRadius: 4, background: 'linear-gradient(90deg,#38bfff,#8be4ff)' } }} />
          <Box sx={{ mt: 1.6, display: 'grid', gridTemplateColumns: '46px 1fr 64px 1fr 46px', alignItems: 'center', gap: 1 }}><IconButton onClick={cycleRandom} sx={{ width: 44, height: 44, color: randomLabel !== 'Off' ? 'primary.main' : 'text.secondary' }}><ShuffleRoundedIcon /></IconButton><IconButton onClick={state.prevTrack} sx={{ height: 48, borderRadius: 2, color: 'white', background: 'rgba(255,255,255,.055)' }}><SkipPreviousRoundedIcon sx={{ fontSize: 30 }} /></IconButton><IconButton onClick={playing ? state.pause : state.play} sx={{ width: 62, height: 62, color: '#051018', background: 'linear-gradient(135deg,#9deaff,#41c5ff)', boxShadow: '0 8px 28px rgba(39,180,242,.3)', '&:hover': { background: 'linear-gradient(135deg,#9deaff,#41c5ff)' } }}>{playing ? <PauseRoundedIcon sx={{ fontSize: 36 }} /> : <PlayArrowRoundedIcon sx={{ fontSize: 38 }} />}</IconButton><IconButton onClick={state.nextTrack} sx={{ height: 48, borderRadius: 2, color: 'white', background: 'rgba(255,255,255,.055)' }}><SkipNextRoundedIcon sx={{ fontSize: 30 }} /></IconButton><IconButton onClick={cycleRepeat} sx={{ width: 44, height: 44, color: repeatLabel !== 'Off' ? 'primary.main' : 'text.secondary' }}><RepeatRoundedIcon /></IconButton></Box>
        </Box>
      </Box>
    </Box>
  </Box>
}
