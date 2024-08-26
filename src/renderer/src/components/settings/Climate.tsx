import {
  FormControlLabel,
  styled,
  SwitchProps,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import Box from '@mui/material/Box'
import Switch from '@mui/material/Switch'
import Grid from '@mui/material/Unstable_Grid2'
import { useCanGatewayStore } from '../../store/store'
import AudioSlider from '../mediaComponents/Amplifier/AudioSlider' // Grid version 2

export function Climate() {
  const [
    autoLock,
    driveAwayLocking,
    globalWindowClose,
    globalWindowOpen,
    mirrorFoldBack,
    passiveArming,
    twoStageLocking,
    alarmSensors,
    mirrorDip,
    setAutoLock,
    setDriveAway,
    setGlobalWindowsClose,
    setGlobalWindowsOpen,
    setMirrorFoldBack,
    setPassiveArming,
    setTwoStageUnlocking,
    setAlarmSensors,
    setMirrorDip
  ] = useCanGatewayStore((state) => [
    state.autoLock,
    state.driveAwayLocking,
    state.globalWindowClose,
    state.globalWindowOpen,
    state.mirrorFoldBack,
    state.passiveArming,
    state.twoStageLocking,
    state.alarmSensors,
    state.mirrorDip,
    state.setAutoLock,
    state.setDriveAway,
    state.setGlobalWindowsClose,
    state.setGlobalWindowsOpen,
    state.setMirrorFoldBack,
    state.setPassiveArming,
    state.setTwoStageUnlocking,
    state.setAlarmSensors,
    state.setMirrorDip
  ])

  const driveAway = [
    <ToggleButton sx={{ minWidth: '20%' }} value={1} key={'1'}>
      LOW
    </ToggleButton>,
    <ToggleButton value={2} key={'2'}>
      MEDIUM
    </ToggleButton>,
    <ToggleButton value={3} key={'3'}>
      HIGH
    </ToggleButton>
  ]

  const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: number) => {
    setDriveAway(newAlignment)
  }

  const control = {
    value: driveAwayLocking,
    onChange: handleChange,
    exclusive: true
  }

  return (
    <Grid container sx={{ marginTop: '10px', maxHeight: '80%', flexGrow: 1 }}>
      <Grid xs={12} sx={{ height: '20%', display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '70%'
          }}
        >
          <AudioSlider min={-6} max={6} name={'SENSITIVITY'} />
        </Box>
      </Grid>
    </Grid>
  )
}
