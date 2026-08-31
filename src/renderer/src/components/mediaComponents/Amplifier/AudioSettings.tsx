import { Box, Slider, Switch, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import GraphicEqRoundedIcon from '@mui/icons-material/GraphicEqRounded'
import { useNavigate } from 'react-router-dom'
import { useAmplifierStore } from '../../../store/store'

const controls = [
  { key: 'bass', label: 'Bass', min: -6, max: 6 },
  { key: 'treble', label: 'Treble', min: -6, max: 6 },
  { key: 'balance', label: 'Balance', min: -10, max: 10 },
  { key: 'fader', label: 'Fader', min: -10, max: 10 },
  { key: 'subwoofer', label: 'Subwoofer', min: 0, max: 20 },
  { key: 'centre', label: 'Centre', min: -6, max: 6 }
] as const

export default function AudioSettings() {
  const navigate = useNavigate()
  const amp = useAmplifierStore()
  const setters = { bass: amp.setBass, treble: amp.setTreble, balance: amp.setBalance, fader: amp.setFader, subwoofer: amp.setSubwoofer, centre: amp.setCentre }
  return <Box sx={{ height: '100%', p: 1.5, display: 'grid', gridTemplateRows: '48px minmax(0,1fr)', gap: 1.2, overflow: 'hidden' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}><Box className="settings-back" onClick={() => navigate('/settings')}><ArrowBackRoundedIcon /></Box><Box sx={{ flex: 1 }}><Typography sx={{ fontSize: 24, fontWeight: 600 }}>Audio settings</Typography><Typography sx={{ mt: -.4, color: 'text.secondary', fontSize: 11, letterSpacing: 1.2 }}>MERIDIAN SOUND</Typography></Box><Box sx={{ display: 'flex', alignItems: 'center', gap: .5 }}><Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Loudness</Typography><Switch size="small" checked={amp.loudness} onChange={(_, value) => amp.setLoudness(value)} /></Box></Box>
    <Box sx={{ minHeight: 0, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 220px', gap: 1.2 }}>
      <Box className="glass-panel" sx={{ borderRadius: 3, p: 1.5, display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '5px 20px', overflow: 'hidden' }}>
        {controls.map(({ key, label, min, max }) => <Box key={key} sx={{ minWidth: 0 }}><Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Typography sx={{ fontSize: 13, fontWeight: 600 }}>{label}</Typography><Typography sx={{ fontSize: 13, color: 'primary.main', fontVariantNumeric: 'tabular-nums' }}>{amp[key]}</Typography></Box><Slider size="small" min={min} max={max} value={amp[key]} onChange={(_, value) => setters[key](value as number)} sx={{ py: 1 }} /></Box>)}
      </Box>
      <Box className="glass-panel" sx={{ borderRadius: 3, p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.3, overflow: 'hidden' }}><Box sx={{ width: 42, height: 42, borderRadius: 2, display: 'grid', placeItems: 'center', color: 'primary.main', background: 'var(--accent-soft)' }}><GraphicEqRoundedIcon /></Box><Box><Typography sx={{ fontSize: 12, color: 'text.secondary', mb: .7 }}>Listening mode</Typography><ToggleButtonGroup orientation="vertical" fullWidth exclusive size="small" value={amp.mode} onChange={(_, value) => value !== null && amp.setMode(value)}><ToggleButton value={0}>Stereo</ToggleButton><ToggleButton value={1}>3 Channel</ToggleButton><ToggleButton value={2}>Dolby PLII</ToggleButton></ToggleButtonGroup></Box><Box sx={{ mt: 'auto' }}><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Surround level</Typography><Slider size="small" min={-6} max={6} value={amp.surround} onChange={(_, value) => amp.setSurround(value as number)} /></Box></Box>
    </Box>
  </Box>
}
