import { useEffect, useState } from 'react'
import AudioDiskPlayerPage from './components/mediaComponents/AudioDiskPlayer/AudioDiskPlayerPage'
import { useAudioControlStore, usePersistantStore } from './store/store'
import { useNavigate } from 'react-router-dom'
import SettingsIcon from '@mui/icons-material/Settings'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import { Videocam } from '@mui/icons-material'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Icon
} from '@mui/material'
import CarplayIcon from '../public/svgs/carplay.svg?react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import SourceSelection from './components/SourceSelection'
import AmFmOverview from './components/mediaComponents/AmFm/AmFmOverview'

function Base() {
  const [open, setOpen] = useState(false)
  const [setSource, currentSource] = useAudioControlStore((state) => [
    state.setSource,
    state.currentSource
  ])
  const [currentAudioSource] = usePersistantStore((state) => [state.currentSource])
  const navigate = useNavigate()

  useEffect(() => {
    console.log(currentSource, currentAudioSource)
    if (currentSource === null && currentAudioSource !== null) {
      setSource(currentAudioSource)
    }
  }, [])

  const renderActiveSmall = () => {
    switch (currentSource) {
      case 'AudioDiskPlayer':
        return <AudioDiskPlayerPage />
      case 'AmFmTuner':
        return <AmFmOverview />
      case null:
        return <div></div>
    }
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const quickNavMedia = () => {
    switch (currentSource) {
      case 'AudioDiskPlayer':
        navigate('/AudioDiskPlayer')
        break
      case 'AmFmTuner':
        navigate('/AmFmTuner')
        break
    }
  }

  return (
    <div style={{ height: '100%', backgroundColor: 'red', display: 'flex' }}>
      <div
        style={{
          backgroundColor: '#111111',
          minWidth: '50px',
          display: 'flex',
          justifyContent: 'space-around',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Icon fontSize={'large'} style={{ fill: 'white' }} onClick={handleClickOpen}>
          <CarplayIcon />
        </Icon>
        <MusicNoteIcon fontSize={'large'} />
        <SettingsIcon fontSize={'large'} />
        <Videocam fontSize={'large'} />
      </div>
      <div
        style={{
          backgroundColor: '#111111',
          flexGrow: 1,
          display: 'flex',
          paddingTop: '50px',
          paddingRight: '3%',
          paddingBottom: '3%'
        }}
      >
        <div style={{ backgroundColor: '#1e1e1e', minWidth: '35%', borderRadius: '15px' }}></div>
        <div
          style={{
            backgroundColor: '#1e1e1e',
            flexGrow: 1,
            marginLeft: '20px',
            padding: '10px',
            flexWrap: 'wrap',
            display: 'flex',
            flexDirection: 'row',
            borderRadius: '15px'
          }}
        >
          <div
            style={{
              backgroundColor: '#383838',
              height: 'calc(60% - 10px)',
              marginBottom: '10px',
              width: '100%',
              borderRadius: '15px',
              opacity: 0.7
            }}
          ></div>
          <div
            style={{
              backgroundColor: '#383838',
              height: '40%',
              width: '50%',
              borderRadius: '15px',
              opacity: 0.7
            }}
            onClick={quickNavMedia}
          >
            {currentSource ? renderActiveSmall() : renderActiveSmall()}
          </div>
          <div
            style={{
              backgroundColor: '#383838',
              height: '40%',
              width: '50%',
              borderRadius: '15px',
              opacity: 0.7
            }}
          ></div>
        </div>
      </div>
      <Dialog fullWidth={true} maxWidth={'lg'} open={open} onClose={handleClose}>
        <DialogTitle>Select Audio Source</DialogTitle>
        <DialogContent>
          <Box
            noValidate
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: 'fit-content'
            }}
          >
            <SourceSelection />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Base
