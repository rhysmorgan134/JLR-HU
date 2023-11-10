import Grid from '@mui/material/Unstable_Grid2'
// import Deck from './Deck'
import Title from '../Common/Title'
import AudioControls from './AudioControls'
import MediaProgress from '../Common/MediaProgress'
import visualiser from '../visualiser.gif'
import Image from 'mui-image'
import { useEffect, useState } from 'react'
import { useAudioDiskPlayer } from '../../../store/store'
import Deck from './Deck'

function AudioDiskplayer() {
  const trackNumber = useAudioDiskPlayer((state) => state.trackNumber)
  const [trackName, albumName, playTime, trackTime] = useAudioDiskPlayer((state) => [state.trackName, state.albumName, state.trackTime, state.playTime])
  const [width, setWidth] = useState(100)
  const [height, setHeight] = useState(100)
  const nextTrack = useAudioDiskPlayer((state) => state.nextTrack)
  //socket.emit("runFkt", {address: selectedFunction, type: chosenType.split("_")[0], instance: chosenType.split("_")[1], functionName: alignment})

  useEffect(() => {
    const resizeObserver = new ResizeObserver((event) => {
      setWidth(event[0].contentBoxSize[0].inlineSize)
      setHeight(event[0].contentBoxSize[0].blockSize)
    })

    resizeObserver.observe(document.getElementById('AudioDiskPlayer'))
  })

  // const sendMessage = (functionName, data=[]) => {
  //     let address = Buffer.from([sourceAddrHigh, sourceAddrLow])
  //     address = address.readUint16BE(0)
  //     socket.emit("runFkt", {address: address, type: 'AudioDiskPlayer', instance: instID, functionName: functionName, data: data})
  // }

  const preSendMessage = (functionName, data = []) => {
    sendMessage(functionName, 'AudioDiskPlayer', data)
  }

  const renderDeck = () => {
    if (width > 500) {
      return (
        <Grid xs={12} flexGrow={0} sx={{height: 0.1}}>
          <Deck sendMessage={preSendMessage}/>
        </Grid>
      )
    } else {
      return null
    }
  }

  const renderVisualiser = () => {
    if (width > 500) {
      return (
        <Grid xs={6}>
          <Image src={visualiser} style={{ maxHeight: '100%', objectFit: 'contain' }} />
        </Grid>
      )
    } else {
      return null
    }
  }

  const renderProgess = () => {
    if (width > 500) {
      return (
        <Grid xs={12} sx={{height: 0.1}}>
          <MediaProgress trackTime={trackTime} playTime={playTime} />
        </Grid>
      )
    } else {
      return null
    }
  }

  return (
    <Grid container justifyContent="center" direction={'row'} id={'AudioDiskPlayer'} sx={{height: '100%'}}>
      {renderDeck()}
      <Grid container xs={12} sx={{flexGrow: 1, height: 0.7}}>
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
      <Grid xs={12} sx={{height: 0.1}}>
        <AudioControls sendMessage={preSendMessage}/>
      </Grid>
    </Grid>
  )
}

export default AudioDiskplayer
