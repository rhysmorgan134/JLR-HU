import { Box, Typography } from '@mui/material'
import AlbumRoundedIcon from '@mui/icons-material/AlbumRounded'
import { useAudioDiskPlayer } from '../../../store/store'

export default function AudioDiskOverview() {
  const state = useAudioDiskPlayer()
  return <Box sx={{ height: '100%', p: 1.75, pr: 5, display: 'grid', gridTemplateColumns: '48px minmax(0,1fr)', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}><Box sx={{ width: 46, height: 46, borderRadius: 2.2, display: 'grid', placeItems: 'center', background: 'var(--accent-soft)', color: 'primary.main' }}><AlbumRoundedIcon /></Box><Box sx={{ minWidth: 0 }}><Typography sx={{ fontSize: 10, color: 'primary.main', letterSpacing: 1.5, fontWeight: 700 }}>CD {state.activeDisk ?? '—'} · TRACK {state.trackNo ?? '—'}</Typography><Typography noWrap sx={{ mt: .25, fontSize: 18, fontWeight: 600 }}>{state.trackTitle?.trim() || 'CD Player'}</Typography><Typography noWrap sx={{ fontSize: 12, color: 'text.secondary' }}>Tap to open player</Typography></Box></Box>
}
