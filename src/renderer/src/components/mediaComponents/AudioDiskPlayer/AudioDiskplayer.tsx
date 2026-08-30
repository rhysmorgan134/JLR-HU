import Grid from '@mui/material/Unstable_Grid2'
import Title from '../Common/Title'
import AudioControls from './AudioControls'
import MediaProgress from '../Common/MediaProgress'
import { useEffect, useState } from 'react'
import { useAudioControlStore, useAudioDiskPlayer } from '../../../store/store'
import Deck from './Deck'
import { IconButton, Skeleton } from '@mui/material'
import ReplyIcon from '@mui/icons-material/Reply'
import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

function AudioDiskplayer() {
  const [setSource] = useAudioControlStore((state) => [state.setSource])
  const [
    deckStatus,
    diskTime,
    trackTime,
    titleTime,
    trackPosition,
    activeDisk,
    disk1,
    disk2,
    disk3,
    disk4,
    disk5,
    disk6,
    trackTitle,
    audioTime,
    trackNo,
    deckEvent,
    mediaEvent,
    random,
    repeat,
    title,
    type,
    fileSystem,
    firstTrack,
    lastTrack,
    totalPlayTime,
    nextTrack,
    prevTrack,
    play,
    pause,
    setRandom,
    setRepeat,
    setActiveDisk
  ] = useAudioDiskPlayer((state) => [
    state.deckStatus,
    state.diskTime,
    state.trackTime,
    state.titleTime,
    state.trackPosition,
    state.activeDisk,
    state.disk1,
    state.disk2,
    state.disk3,
    state.disk4,
    state.disk5,
    state.disk6,
    state.trackTitle,
    state.audioTime,
    state.trackNo,
    state.deckEvent,
    state.mediaEvent,
    state.random,
    state.repeat,
    state.title,
    state.type,
    state.fileSystem,
    state.firstTrack,
    state.lastTrack,
    state.totalPlayTime,
    state.nextTrack,
    state.prevTrack,
    state.play,
    state.pause,
    state.setRandom,
    state.setRepeat,
    state.setActiveDisk
  ])
  const [width, setWidth] = useState(100)
  // const navigate = useNavigate()
  const [height, setHeight] = useState(100)
  const navigate = useNavigate()

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
    setSource('audioDiskPlayer')
  }, [])

  const renderDeck = () => {
    if (width > 500) {
      return (
        <Grid xs={12} flexGrow={0} sx={{ height: 0.1 }}>
          <Skeleton />
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
          {trackTime ? (
            <MediaProgress trackTime={trackTime} />
          ) : (
            <Skeleton variant={'rectangular'}></Skeleton>
          )}
        </Grid>
      )
    } else {
      return null
    }
  }

  const returnHome = () => {
    navigate('/home')
  }

  return (
    <Grid
      container
      justifyContent="center"
      direction={'row'}
      id={'AudioDiskPlayer'}
      sx={{ minHeight: '100%' }}
    >
      <Grid container xs={12} sx={{ flexGrow: 1, height: 0.2 }}>
        <ArrowBackIcon sx={{ marginLeft: '10px', marginTop: '10px' }} onClick={returnHome} />
        {renderDeck()}
      </Grid>

      <Grid container xs={12} sx={{ flexGrow: 1, height: 0.6 }}>
        <Grid container xs={width > 500 ? 6 : 12} sx={{ flexGrow: 1 }}>
          {width > 500 ? (
            <Grid xs={12}>
              {activeDisk && eval('disk' + activeDisk) ? (
                <Title type={'album'} title={eval('disk' + activeDisk)['title']} />
              ) : (
                <Skeleton variant={'rectangular'} />
              )}
            </Grid>
          ) : (
            <></>
          )}
          <Grid xs={12}>
            {trackTitle !== null && trackNo ? (
              <Title type={'song'} title={trackTitle !== '' ? trackTitle : `Track: ${trackNo}`} />
            ) : (
              <Skeleton variant={'rectangular'} />
            )}
          </Grid>
          {width > 500 ? (
            <Grid xs={12}>
              {trackNo && activeDisk ? (
                <Title
                  type={'track'}
                  title={`Track: ${trackNo} / ${
                    eval('disk' + activeDisk)['lastTrack']
                      ? eval('disk' + activeDisk)['lastTrack']
                      : ''
                  }`}
                />
              ) : (
                <Skeleton variant={'rectangular'} />
              )}
            </Grid>
          ) : (
            <></>
          )}
        </Grid>
        {renderVisualiser()}
      </Grid>
      {renderProgess()}
      <Grid xs={12} sx={{ height: 0.2 }}>
        <AudioControls />
      </Grid>
    </Grid>
  )
}

export default AudioDiskplayer
