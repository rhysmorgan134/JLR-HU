import { Box, Typography } from '@mui/material'
import PhoneIphoneRoundedIcon from '@mui/icons-material/PhoneIphoneRounded'
import { useCarplayStore } from '../../store/store'

const imageMime = (base64: string) => {
  if (base64.startsWith('iVBOR')) return 'image/png'
  if (base64.startsWith('R0lGOD')) return 'image/gif'
  if (base64.startsWith('UklGR')) return 'image/webp'
  return 'image/jpeg'
}

export default function CarplayOverview() {
  const { plugged, mediaSongName, mediaAlbumName, mediaArtistName, mediaAppName, mediaAlbumCover } = useCarplayStore()
  const artwork = mediaAlbumCover
    ? `data:${imageMime(mediaAlbumCover)};base64,${mediaAlbumCover}`
    : null

  return <Box sx={{ height: '100%', p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
    <Box sx={{ width: 92, height: 92, flex: '0 0 auto', borderRadius: 2.2, overflow: 'hidden', display: 'grid', placeItems: 'center', color: 'primary.main', background: 'linear-gradient(145deg,rgba(103,216,255,.18),rgba(139,156,255,.12))' }}>
      {artwork ? <Box component="img" src={artwork} alt="Album cover" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <PhoneIphoneRoundedIcon sx={{ fontSize: 42 }} />}
    </Box>
    <Box sx={{ minWidth: 0, pr: 3 }}>
      <Typography sx={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.7, color: 'primary.main' }}>{mediaAppName || 'APPLE CARPLAY'}</Typography>
      <Typography noWrap sx={{ mt: .35, fontSize: 20, lineHeight: 1.15, fontWeight: 600 }}>{mediaSongName || (plugged ? 'CarPlay is running' : 'CarPlay disconnected')}</Typography>
      <Typography noWrap sx={{ mt: .45, fontSize: 12, color: 'text.secondary' }}>{[mediaArtistName, mediaAlbumName].filter(Boolean).join(' · ') || (plugged ? 'Open CarPlay to continue' : 'Connect your phone to the dongle')}</Typography>
    </Box>
  </Box>
}
