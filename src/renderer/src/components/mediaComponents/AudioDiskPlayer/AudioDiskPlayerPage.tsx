import AudioDiskplayer from './AudioDiskplayer'
import { Fade, Zoom } from '@mui/material'
import Box from '@mui/material/Box'

export default function AudioDiskPlayerPage() {
  return (
    <Zoom in={true} style={{ transitionDuration: 1000, height: '100%', width: '100%' }}>
      <Box>
        <AudioDiskplayer />
      </Box>
    </Zoom>
  )
}
