import Box from '@mui/material/Box'
import SettingsTabs from './Tabs'
import { VehicleAppSettings } from './VehicleAppSettings'
import { useState } from 'react'
import { VehicleSettings } from './VehicleSettings'
import { AudioLevels } from './AudioLevels'
import { Climate } from './Climate'
import AudioSettings from '../mediaComponents/Amplifier/AudioSettings'

export function Settings() {
  const [page, setPage] = useState('vehicleAppSettings')

  const renderPage = () => {
    switch (page) {
      case 'vehicleAppSettings':
        return <VehicleAppSettings />
      case 'climate':
        return <Climate />
      case 'audioLevels':
        return <AudioLevels />
      case 'audioSettings':
        return <AudioSettings />
      case 'vehicleSettings':
        return <VehicleSettings />
    }
  }

  return (
    <Box className={'mainView'} sx={{ display: 'flex', flexDirection: 'column' }}>
      <SettingsTabs switchPage={setPage}></SettingsTabs>
      {renderPage()}
    </Box>
  )
}
