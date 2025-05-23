import Grid from '@mui/material/Unstable_Grid2'
import { Image } from 'mui-image'

function ScreenSaver() {
  return (
    <Grid
      container
      justifyContent="center"
      direction={'column'}
      id={'screensaver'}
      sx={{ height: 1, display: 'flex', flexGrow: 1 }}
    >
      <Image src={'../../../../public/wallPaper.png'}></Image>
    </Grid>
  )
}

export default ScreenSaver
