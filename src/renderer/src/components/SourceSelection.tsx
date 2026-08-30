import Grid from '@mui/material/Unstable_Grid2'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Backdrop, Modal, Slide, Stack } from '@mui/material'
import { ExitToApp, Memory } from '@mui/icons-material'
import React from 'react'
import AudioSettings from './mediaComponents/Amplifier/AudioSettings'
import { useNavigate } from 'react-router-dom'
import { useAudioControlStore, useCarplayStore } from '../store/store'
import RadioIcon from '@mui/icons-material/Radio'
import AlbumIcon from '@mui/icons-material/Album'

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

export default function SourceSelection() {
  const [setSource] = useAudioControlStore((state) => [state.setSource])
  return (
    <div>
      <RadioIcon onClick={() => setSource('AmFmTuner')}></RadioIcon>
      <AlbumIcon onClick={() => setSource('AudioDiskPlayer')}></AlbumIcon>
      <Memory></Memory>
    </div>
  )
}
