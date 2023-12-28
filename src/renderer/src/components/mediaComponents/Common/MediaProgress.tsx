import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'

export default function MediaProgress({ trackTime, playTime }) {
  const getTimeString = (data) => {
    const totalSeconds = data / 1000
    const seconds = totalSeconds % 60
    const minutes = Math.floor(totalSeconds / 60)
    return minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')
  }

  const normalise = () => {
    return (playTime * 100) / trackTime
  }

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
      <Typography>{getTimeString(playTime)}</Typography>
      <LinearProgress
        variant={'determinate'}
        value={normalise()}
        sx={{
          flexGrow: 1,
          height: '10px',
          borderRadius: 5,
          marginLeft: '1rem',
          marginRight: '1rem'
        }}
      />
      <Typography>{getTimeString(trackTime)}</Typography>
    </Box>
  )
}
