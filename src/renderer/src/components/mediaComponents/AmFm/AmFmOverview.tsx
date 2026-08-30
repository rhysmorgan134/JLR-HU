import { Box, Typography } from '@mui/material'
import RadioRoundedIcon from '@mui/icons-material/RadioRounded'
import { useAmFmTunerStore } from '../../../store/store'

export default function AmFmOverview() {
  const state = useAmFmTunerStore()
  const isAm = state.selectedBank === 'am'
  const frequency = state.frequency == null ? '---' : isAm ? `${state.frequency} kHz` : `${(state.frequency / 1000).toFixed(1)} MHz`
  const station = state.radioText?.includes('STN') ? '' : state.radioText?.trim()
  const playing = state.nowPlaying?.includes('STN') ? '' : state.nowPlaying?.replace(/^Now Playing:\s*/i,'').trim()
  return <Box sx={{ height: '100%', p: 1.75, pr: 5, display: 'grid', gridTemplateColumns: '48px minmax(0,1fr)', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}><Box sx={{ width: 46, height: 46, borderRadius: 2.2, display: 'grid', placeItems: 'center', background: 'var(--accent-soft)', color: 'primary.main' }}><RadioRoundedIcon /></Box><Box sx={{ minWidth: 0 }}><Typography sx={{ fontSize: 10, color: 'primary.main', letterSpacing: 1.5, fontWeight: 700 }}>{state.selectedBank.toUpperCase()} · {frequency}</Typography><Typography noWrap sx={{ mt: .25, fontSize: 18, fontWeight: 600 }}>{station || 'Radio'}</Typography><Typography noWrap sx={{ fontSize: 12, color: 'text.secondary' }}>{playing || 'Tap to open tuner'}</Typography></Box></Box>
}
