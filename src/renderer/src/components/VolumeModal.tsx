import { useEffect, useRef, useState } from 'react'
import { Box, LinearProgress, Modal, Typography } from '@mui/material'
import { VolumeUpRounded } from '@mui/icons-material'
import { useVolumeStore } from '../store/store'

const volumeStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 390,
  maxWidth: '80vw',
  background: 'linear-gradient(145deg,rgba(31,42,57,.97),rgba(11,17,25,.98))',
  border: '1px solid rgba(189,221,255,.16)',
  borderRadius: 3,
  boxShadow: '0 25px 70px rgba(0,0,0,.55)',
  p: 2.5
}

export default function VolumeModal() {
  const volume = useVolumeStore((state) => state.audioVolume)
  const [open, setOpen] = useState(false)
  const previousVolume = useRef<number | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (volume === null) return

    if (previousVolume.current !== null && previousVolume.current !== volume) {
      setOpen(true)

      if (closeTimer.current) clearTimeout(closeTimer.current)
      closeTimer.current = setTimeout(() => setOpen(false), 1000)
    }

    previousVolume.current = volume
  }, [volume])

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    },
    []
  )

  return (
    <Modal open={open} aria-label="Volume" disableAutoFocus hideBackdrop>
      <Box sx={volumeStyle}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '48px minmax(0,1fr) 40px', alignItems: 'center', gap: 1.7 }}>
          <Box sx={{ width: 46, height: 46, borderRadius: '50%', display: 'grid', placeItems: 'center', color: 'primary.main', background: 'var(--accent-soft)' }}><VolumeUpRounded /></Box>
          <Box><Typography sx={{ mb: .8, fontSize: 11, color: 'text.secondary', letterSpacing: 1.5 }}>MEDIA VOLUME</Typography><LinearProgress variant="determinate" value={((volume ?? 0) / 35) * 100} sx={{ height: 7, borderRadius: 5, background: 'rgba(255,255,255,.09)', '& .MuiLinearProgress-bar': { borderRadius: 5, background: 'linear-gradient(90deg,#36bdff,#90e8ff)' } }} /></Box>
          <Typography sx={{ fontSize: 27, fontWeight: 300, textAlign: 'right' }}>{volume ?? 0}</Typography>
        </Box>
      </Box>
    </Modal>
  )
}
