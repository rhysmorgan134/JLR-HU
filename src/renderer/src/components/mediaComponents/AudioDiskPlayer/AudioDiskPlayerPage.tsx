import AudioDiskplayer from './AudioDiskplayer'
import { Zoom } from '@mui/material'
import Box from '@mui/material/Box'

export default function AudioDiskPlayerPage() {
  return (
    <Zoom
      in={true}
      style={{ transitionDuration: 1000, paddingBottom: '20px' }}
      className={'mainView'}
    >
      <Box>
        <AudioDiskplayer />
      </Box>
    </Zoom>
  )
}
