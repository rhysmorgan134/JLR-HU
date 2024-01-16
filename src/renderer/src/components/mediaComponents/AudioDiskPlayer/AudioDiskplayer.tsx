import Grid from '@mui/material/Unstable_Grid2'
import Title from '../Common/Title'
import AudioControls from './AudioControls'
import MediaProgress from '../Common/MediaProgress'
import { useEffect, useState } from 'react'
import { useAudioDiskPlayer } from '../../../store/store'
import Deck from './Deck'
import { IconButton } from '@mui/material'
import ReplyIcon from '@mui/icons-material/Reply'
import { useNavigate } from 'react-router-dom'

function AudioDiskplayer() {
  const trackNumber = useAudioDiskPlayer((state) => state.trackNumber)
  const [trackName, albumName, playTime, trackTime, allocate] = useAudioDiskPlayer((state) => [
    state.trackName,
    state.albumName,
    state.trackTime,
    state.playTime,
    state.allocate
  ])
  const [width, setWidth] = useState(100)
  const navigate = useNavigate()
  const [height, setHeight] = useState(100)
  const nextTrack = useAudioDiskPlayer((state) => state.nextTrack)

  useEffect(() => {
    const resizeObserver = new ResizeObserver((event) => {
      setWidth(event[0].contentBoxSize[0].inlineSize)
      setHeight(event[0].contentBoxSize[0].blockSize)
    })

    const page = document.getElementById('AudioDiskPlayer')
    if (page) {
      resizeObserver.observe(page)
    }
  })

  useEffect(() => {
    console.log('running allocation')
    // allocate()
  }, [])

  const renderDeck = () => {
    if (width > 500) {
      return (
        <Grid xs={12} flexGrow={0} sx={{ height: 0.1 }}>
          <Deck />
        </Grid>
      )
    } else {
      return null
    }
  }

  const renderVisualiser = () => {
    if (width > 500) {
      return <Grid xs={6}>Some cool image</Grid>
    } else {
      return null
    }
  }

  const renderProgess = () => {
    if (width > 500) {
      return (
        <Grid xs={12} sx={{ height: 0.1 }}>
          <MediaProgress trackTime={trackTime} playTime={playTime} />
        </Grid>
      )
    } else {
      return null
    }
  }

  return (
    <Grid
      container
      justifyContent="center"
      direction={'row'}
      id={'AudioDiskPlayer'}
      sx={{ height: '100%' }}
    >
      <Grid xs={12} sx={{ justifyContent: 'right', display: 'flex', height: 0.1 }}>
        <IconButton onClick={() => navigate('/')}>
          <ReplyIcon />
        </IconButton>
      </Grid>
      {renderDeck()}
      <Grid container xs={12} sx={{ flexGrow: 1, height: 0.6 }}>
        <Grid container xs={width > 500 ? 6 : 12}>
          <Grid xs={12}>
            <Title type={'album'} title={albumName} />
          </Grid>
          <Grid xs={12}>
            <Title type={'song'} title={trackName} />
          </Grid>
          <Grid xs={12}>
            <Title type={'track'} title={`Track: ${trackNumber}`} />
          </Grid>
        </Grid>
        {renderVisualiser()}
      </Grid>
      {renderProgess()}
      <Grid xs={12} sx={{ height: 0.1 }}>
        <AudioControls />
      </Grid>
    </Grid>
  )
}

export default AudioDiskplayer
