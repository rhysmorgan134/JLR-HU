import AmFmTuner from './AmFmTuner'
import { Zoom } from '@mui/material'
import Box from '@mui/material/Box'

export default function AmFmTunerPage() {
  return (
    <Zoom in={true} style={{ transitionDuration: 1000 }} className={'mainView'}>
      <Box>
        <AmFmTuner />
      </Box>
    </Zoom>
  )
}
