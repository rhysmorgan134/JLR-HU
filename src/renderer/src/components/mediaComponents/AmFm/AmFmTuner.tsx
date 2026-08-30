import { Box, Button, Paper, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import FastRewindIcon from '@mui/icons-material/FastRewind'
import FastForwardIcon from '@mui/icons-material/FastForward'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAmFmTunerStore } from '../../../store/store'

type Preset = { stationName: string; frequency: number }

function PresetButton({
  number,
  station,
  onSelect,
  onSave
}: {
  number: number
  station?: Preset
  onSelect: () => void
  onSave: () => void
}) {
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const longPressTriggered = useRef(false)

  const startHold = () => {
    longPressTriggered.current = false
    holdTimer.current = setTimeout(() => {
      longPressTriggered.current = true
      onSave()
    }, 650)
  }

  const cancelHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current)
    holdTimer.current = null
  }

  return (
    <Button
      variant="outlined"
      onPointerDown={startHold}
      onPointerUp={cancelHold}
      onPointerLeave={cancelHold}
      onPointerCancel={cancelHold}
      onClick={() => {
        if (!longPressTriggered.current) onSelect()
        longPressTriggered.current = false
      }}
      sx={{
        minWidth: 0,
        minHeight: 64,
        width: '100%',
        height: '100%',
        p: 0.5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        lineHeight: 1,
        color: 'common.white',
        border: '1px solid',
        borderColor: 'rgba(255, 255, 255, 0.28)',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        '&:hover': {
          borderColor: 'rgba(255, 255, 255, 0.5)',
          backgroundColor: 'rgba(255, 255, 255, 0.12)'
        }
      }}
    >
      <Typography sx={{ fontSize: 18, fontWeight: 600 }}>{number}</Typography>
      {station && (
        <>
          <Typography
            sx={{
              fontSize: 12,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%'
            }}
          >
            {station.stationName || '---'}
          </Typography>
          <Typography sx={{ fontSize: 11 }}>
            {station.frequency ? `${(station.frequency / 1000).toFixed(1)} MHz` : '---'}
          </Typography>
        </>
      )}
    </Button>
  )
}

function AmFmTuner() {
  const navigate = useNavigate()

  const [
    frequency,
    selectedBank,
    radioText,
    nowPlaying,
    fm1,
    fm2,
    am,
    seekForward,
    seekBack,
    setTunerType,
    autostore,
    getPresets,
    selectPreset,
    savePreset
  ] = useAmFmTunerStore((state) => [
    state.frequency,
    state.selectedBank,
    state.radioText,
    state.nowPlaying,
    state.fm1,
    state.fm2,
    state.am,
    state.seekForward,
    state.seekBack,
    state.setTunerType,
    state.autostore,
    state.getPresets,
    state.selectPreset,
    state.savePreset
  ])

  useEffect(() => {
    getPresets()
  }, [getPresets])

  const currentBank = selectedBank as 'fm1' | 'fm2' | 'am'

  const presets = currentBank === 'fm1' ? fm1 : currentBank === 'fm2' ? fm2 : am

  const changeTuner = (_event, value) => {
    if (!value) return

    if (value === 'fma') {
      autostore()
    } else {
      setTunerType(value)
    }
  }

  const returnHome = () => {
    navigate('/home')
  }

  const formatFrequency = () => {
    if (frequency == null) return '---.-'

    return (frequency / 1000).toFixed(1)
  }

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
        p: 1.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: 55,
          minHeight: 55,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <ArrowBackIcon
          onClick={returnHome}
          sx={{
            fontSize: 42,
            mr: 2,
            cursor: 'pointer'
          }}
        />

        <Typography
          sx={{
            fontSize: 32,
            fontWeight: 600
          }}
        >
          Radio
        </Typography>
      </Box>

      {/* Bank selector */}
      <ToggleButtonGroup
        exclusive
        fullWidth
        value={currentBank}
        onChange={changeTuner}
        sx={{
          height: 60,
          minHeight: 60,

          '& .MuiToggleButton-root': {
            fontSize: 20,
            fontWeight: 600
          }
        }}
      >
        <ToggleButton value="fm1">FM1</ToggleButton>

        <ToggleButton value="fm2">FM2</ToggleButton>

        <ToggleButton value="am">AM</ToggleButton>

        <ToggleButton value="fma">AUTO</ToggleButton>
      </ToggleButtonGroup>

      {/* Main radio area */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1.5
        }}
      >
        {/* Current station */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            display: 'grid',
            gridTemplateRows: '1fr auto auto auto',
            justifyItems: 'center',
            alignItems: 'center',
            minHeight: 0,
            overflow: 'hidden',
            p: 2,
            rowGap: 1
          }}
        >
          <Typography
            sx={{
              fontSize: 42,
              fontWeight: 600,
              lineHeight: 1
            }}
          >
            {formatFrequency()}
            <Typography
              component="span"
              sx={{
                fontSize: 20,
                ml: 0.5
              }}
            >
              MHz
            </Typography>
          </Typography>

          <Typography
            sx={{
              fontSize: 22,
              fontWeight: 500,
              mt: 1,
              textAlign: 'center',
              minHeight: 30
            }}
          >
            {radioText?.includes('STN') ? 'No radio text' : radioText?.trim() || 'No radio text'}
          </Typography>

          {nowPlaying?.trim() && !nowPlaying?.includes('STN') && (
            <Typography
              sx={{
                fontSize: 16,
                textAlign: 'center',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {nowPlaying.trim()}
            </Typography>
          )}

          {/* Seek buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mt: 2
            }}
          >
            <Button
              variant="outlined"
              onClick={seekBack}
              sx={{
                minWidth: 90,
                height: 70,
                borderRadius: 2,
                color: 'common.white',
                borderColor: 'rgba(255, 255, 255, 0.35)',
                backgroundColor: 'rgba(255, 255, 255, 0.06)'
              }}
            >
              <FastRewindIcon sx={{ fontSize: 42 }} />
            </Button>

            <Button
              variant="outlined"
              onClick={seekForward}
              sx={{
                minWidth: 90,
                height: 70,
                borderRadius: 2,
                color: 'common.white',
                borderColor: 'rgba(255, 255, 255, 0.35)',
                backgroundColor: 'rgba(255, 255, 255, 0.06)'
              }}
            >
              <FastForwardIcon sx={{ fontSize: 42 }} />
            </Button>
          </Box>
        </Paper>

        {/* Presets */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            p: 1.5,
            display: 'grid',
            gridTemplateRows: 'auto minmax(0, 1fr)',
            minHeight: 0,
            overflow: 'hidden'
          }}
        >
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 600,
              mb: 1
            }}
          >
            PRESETS
          </Typography>

          <Box
            sx={{
              minHeight: 210,
              height: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gridTemplateRows: 'repeat(3, minmax(0, 1fr))',
              gap: 1
            }}
          >
            {Array.from({ length: 9 }, (_, index) => {
              const number = index + 1

              // Support either 0-8 or 1-9 keys
              const station = presets?.[number] ?? presets?.[index]

              return (
                <PresetButton
                  key={number}
                  number={number}
                  station={station}
                  onSelect={() => selectPreset(currentBank, number)}
                  onSave={() => savePreset(currentBank, number)}
                />
              )
            })}
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default AmFmTuner
