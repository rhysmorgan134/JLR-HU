import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import './topData.css'

interface TopDataProps {
  label: string
  value: string | number | null
  units: string
}

export function TopData({ label, value, units }: TopDataProps) {
  return (
    <Box sx={{ display: 'flex', marginLeft: '10px', marginRight: '10px' }}>
      <Typography sx={{ marginRight: '5px' }}>{label}</Typography>
      {value ? (
        <Typography>
          {value}
          {units}
        </Typography>
      ) : (
        <div></div>
      )}
    </Box>
  )
}
