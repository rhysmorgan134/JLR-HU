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
import { useCanGatewayStore } from '../../store/store' // Grid version 2

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  marginRight: '10px',
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5
      }
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff'
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600]
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3
    }
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500
    })
  }
}))

export function VehicleSettings() {
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

  const workMode = [
    <ToggleButton value={false} key={'carplay'}>
      CARPLAY
    </ToggleButton>,
    <ToggleButton value={true} key={'carplay'}>
      ANDROID
    </ToggleButton>
  ]

  const theme = [
    <ToggleButton value={false} key={'day'}>
      DAY
    </ToggleButton>,
    <ToggleButton value={true} key={'night'}>
      NIGHT
    </ToggleButton>
  ]

  const driveAway = [
    <ToggleButton value={0} key={'0'}>
      OFF
    </ToggleButton>,
    <ToggleButton value={1} key={'1'}>
      5 MPH
    </ToggleButton>,
    <ToggleButton value={2} key={'2'}>
      10 MPH
    </ToggleButton>,
    <ToggleButton value={3} key={'3'}>
      15 MPH
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
      <Grid xs={6}>
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Typography sx={{ flexGrow: 1 }}>Auto Locking</Typography>
          <IOSSwitch checked={autoLock} onChange={() => setAutoLock(!autoLock)} />
        </Box>
      </Grid>
      <Grid xs={6} sx={{ height: '20%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Typography sx={{ flexGrow: 1 }}>Mirror Fold Back</Typography>
          <IOSSwitch checked={mirrorFoldBack} onChange={() => setMirrorFoldBack(!mirrorFoldBack)} />
        </Box>
      </Grid>
      <Grid xs={6} sx={{ height: '20%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Typography sx={{ flexGrow: 1 }}>Global Window Close</Typography>
          <IOSSwitch
            checked={globalWindowClose}
            onChange={() => setGlobalWindowsClose(!globalWindowClose)}
          />
        </Box>
      </Grid>
      <Grid xs={6} sx={{ height: '20%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Typography sx={{ flexGrow: 1 }}>Reverse Mirror Dip</Typography>
          <IOSSwitch checked={mirrorDip} onChange={() => setMirrorDip(!mirrorDip)} />
        </Box>
      </Grid>
      <Grid xs={6} sx={{ height: '20%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Typography sx={{ flexGrow: 1 }}>Global Window Open</Typography>
          <IOSSwitch
            checked={globalWindowOpen}
            onChange={() => setGlobalWindowsOpen(!globalWindowOpen)}
          />
        </Box>
      </Grid>
      <Grid xs={6} sx={{ height: '20%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Typography sx={{ flexGrow: 1 }}>Passive Arming</Typography>
          <IOSSwitch checked={passiveArming} onChange={() => setPassiveArming(!passiveArming)} />
        </Box>
      </Grid>
      <Grid xs={6} sx={{ height: '20%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Typography sx={{ flexGrow: 1 }}>Two Stage Locking</Typography>
          <IOSSwitch
            checked={twoStageLocking}
            onChange={() => setTwoStageUnlocking(!twoStageLocking)}
          />
        </Box>
      </Grid>
      <Grid xs={6} sx={{ height: '20%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Typography sx={{ flexGrow: 1 }}>Alarm Sensors</Typography>
          <IOSSwitch checked={alarmSensors} onChange={() => setAlarmSensors(!alarmSensors)} />
        </Box>
      </Grid>
      <Grid xs={12} sx={{ height: '20%' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'centre',
            alignItems: 'center'
          }}
        >
          <Typography sx={{ flexGrow: 1 }}>Drive Away Locking</Typography>
          <ToggleButtonGroup {...control}>{driveAway}</ToggleButtonGroup>
        </Box>
      </Grid>
    </Grid>
  )
}
