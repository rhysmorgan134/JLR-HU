import Box from '@mui/material/Box'
import { BatteryAlert } from '@mui/icons-material'
import Typography from '@mui/material/Typography'

const LowBattery = () => {
  return (
    <Box>
      <BatteryAlert></BatteryAlert>
      <Typography>BATTERY LOW SYSTEM WILL SHUTDOWN IN 5 MINUTES</Typography>
    </Box>
  )
}

export default LowBattery
