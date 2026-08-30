import { useEffect, useRef, useState } from 'react'
import { Box, Modal, Slider, Stack } from '@mui/material'
import { VolumeDown, VolumeUp } from '@mui/icons-material'
import { useVolumeStore } from '../store/store'

const volumeStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxWidth: '80vw',
  bgcolor: '#000000',
  border: 'none',
  borderRadius: 2,
  boxShadow: 24,
  p: 4
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
    <Modal open={open} aria-label="Volume" disableAutoFocus>
      <Box sx={volumeStyle}>
        <Stack spacing={2} direction="row" alignItems="center">
          <VolumeDown />
          <Slider
            aria-label="Volume level"
            value={volume ?? 0}
            min={0}
            max={35}
            sx={{ transition: 'none' }}
          />
          <VolumeUp />
        </Stack>
      </Box>
    </Modal>
  )
}
