import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useAmplifierStore, useVolumeStore } from '../../store/store'
import AudioSlider from '../mediaComponents/Amplifier/AudioSlider'

export function AudioLevels() {
  const volume = useVolumeStore()
  const [avc, setAvc] = useAmplifierStore((state) => [state.avc, state.setAvc])

  const levels = [
    { name: 'Parking aid', value: volume.parkingVolumeFront, setValue: volume.setParkingVolume },
    { name: 'Voice', value: volume.voiceVolume, setValue: volume.setVoiceVolume },
    { name: 'Navigation', value: volume.navigationVolume, setValue: volume.setNavigationVolume },
    { name: 'Phone', value: volume.phoneVolume, setValue: volume.setPhoneVolume }
  ]

  return (
    <Grid container spacing={1} sx={{ height: '100%', overflow: 'hidden', p: 1 }}>
      <Grid xs={12}>
        <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
          <Typography>Automatic volume control</Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={avc}
            onChange={(_event, value: number | null) => value !== null && setAvc(value)}
          >
            <ToggleButton value={0}>Low</ToggleButton>
            <ToggleButton value={1}>Medium</ToggleButton>
            <ToggleButton value={2}>High</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Grid>
      {levels.map((level) => (
        <Grid xs={6} key={level.name}>
          <AudioSlider
            min={0}
            max={25}
            name={level.name}
            value={level.value ?? 0}
            setValue={level.setValue}
            disabled={level.value === null}
          />
        </Grid>
      ))}
    </Grid>
  )
}
