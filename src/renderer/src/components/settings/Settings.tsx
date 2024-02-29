import Box from '@mui/material/Box'
import SettingsTabs from './Tabs'
import { VehicleSettings } from './VehicleSettings'

export function Settings() {
  return (
    <Box className={'mainView'} sx={{ display: 'flex', flexDirection: 'column' }}>
      <SettingsTabs></SettingsTabs>
      <VehicleSettings />
    </Box>
  )
}
