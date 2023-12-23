import Grid from '@mui/material/Unstable_Grid2'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Backdrop, Modal, Slide, Stack } from '@mui/material'
import { ExitToApp } from '@mui/icons-material'
import React from 'react'
import AudioSettings from './mediaComponents/Amplifier/AudioSettings'
import { useNavigate } from 'react-router-dom'
import { useCarplayStore } from '../store/store'

const style = {
  position: 'absolute',
  top: '0%',
  left: '0%',
  transform: 'translate(-10%, -10%)',
  width: '100%',
  height: '100%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: 'scroll'
}

export default function Launcher() {
  const [openSettings, setOpenSettings] = React.useState(false)
  const setShowSettings = useCarplayStore((state) => state.setShowSettings)
  const navigate = useNavigate()

  return (
    <Box className={'mainView'}>
      <Grid
        container
        spacing={2}
        sx={{ height: '100%', minHeight: '100%', display: 'flex', flexGrow: 1, marginTop: 0 }}
      >
        <Grid xs={3} sx={{ minHeight: '50%', maxHeight: '50%' }}>
          <Button
            sx={{ minHeight: '100%', maxHeight: '100%', width: '100%' }}
            onClick={() => navigate('/carplay')}
            variant={'contained'}
          >
            CARPLAY
          </Button>
        </Grid>
        <Grid xs={3} sx={{ minHeight: '50%', maxHeight: '50%' }}>
          <Button
            sx={{ minHeight: '100%', maxHeight: '100%', width: '100%' }}
            onClick={() => navigate('/audioDiskPlayer')}
            variant={'contained'}
          >
            CD PLAYER
          </Button>
        </Grid>
        <Grid xs={3} sx={{ minHeight: '50%', maxHeight: '50%' }}>
          <Button
            sx={{ minHeight: '100%', maxHeight: '100%', width: '100%' }}
            onClick={() => setOpenSettings(true)}
            variant={'contained'}
          >
            Audio Settings
          </Button>
        </Grid>
        <Grid xs={3} sx={{ minHeight: '50%', maxHeight: '50%' }}>
          <Button
            sx={{ minHeight: '100%', maxHeight: '100%', width: '100%' }}
            onClick={() => navigate('/amFmTuner')}
            variant={'contained'}
          >
            AmFmTuner
          </Button>
        </Grid>
        <Grid xs={3} sx={{ minHeight: '50%', maxHeight: '50%' }}>
          <Button
            sx={{ minHeight: '100%', maxHeight: '100%', width: '100%' }}
            onClick={() => navigate('/settings')}
            variant={'contained'}
          >
            MOST Settings
          </Button>
        </Grid>
        <Grid xs={3} sx={{ minHeight: '50%', maxHeight: '50%' }}>
          <Button
            sx={{ minHeight: '100%', maxHeight: '100%', width: '100%' }}
            variant={'contained'}
            onClick={() => setShowSettings(true)}
          >
            App Settings
          </Button>
        </Grid>
        <Grid xs={3} sx={{ minHeight: '50%', maxHeight: '50%' }}>
          <Button
            sx={{ minHeight: '100%', maxHeight: '100%', width: '100%' }}
            variant={'contained'}
          >
            Car Setup
          </Button>
        </Grid>
      </Grid>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openSettings}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500
          }
        }}
      >
        <Slide direction={'up'} in={openSettings}>
          <Box sx={style}>
            <ExitToApp onClick={() => setOpenSettings(false)} />
            <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
              <AudioSettings />
            </Stack>
          </Box>
        </Slide>
      </Modal>
    </Box>
  )
}
