import { Box, Typography } from '@mui/material'
import RadioIcon from '@mui/icons-material/Radio'
import { useAmFmTunerStore } from '../../../store/store'

export default function AmFmOverview() {
  const { frequency, selectedBank, radioText, nowPlaying, fm1, fm2, am, fma } =
    useAmFmTunerStore((state) => ({
      frequency: state.frequency,
      selectedBank: state.selectedBank,
      radioText: state.radioText,
      nowPlaying: state.nowPlaying,
      fm1: state.fm1,
      fm2: state.fm2,
      am: state.am,
      fma: state.fma
    }))

  const bank = { fm1, fm2, am, fma }[selectedBank] ?? {}
  const matchingPreset = Object.values(bank).find((preset) => preset.frequency === frequency)
  const stationName = (radioText || matchingPreset?.stationName || '').trim()
  const playing = (nowPlaying || '').replace(/^Now Playing:\s*/i, '').trim()
  const isAm = selectedBank === 'am'
  const frequencyText =
    frequency == null
      ? '---'
      : isAm
        ? `${frequency} kHz`
        : `${(frequency / 1000).toFixed(1)} MHz`

  return (
    <Box
      sx={{
        height: '100%',
        boxSizing: 'border-box',
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: 'white',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <RadioIcon sx={{ fontSize: 34 }} />
        <Typography sx={{ fontSize: 18, fontWeight: 700, letterSpacing: 1 }}>
          {selectedBank.toUpperCase()}
        </Typography>
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 34, fontWeight: 700, lineHeight: 1.1 }}>
          {frequencyText}
        </Typography>
        <Typography
          noWrap
          sx={{ mt: 0.75, fontSize: 20, fontWeight: 600, color: stationName ? 'white' : '#bdbdbd' }}
        >
          {stationName || 'Radio'}
        </Typography>
        {playing && (
          <Typography noWrap sx={{ mt: 0.5, fontSize: 15, color: '#d0d0d0' }}>
            {playing}
          </Typography>
        )}
      </Box>
    </Box>
  )
}
