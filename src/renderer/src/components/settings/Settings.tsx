import Box from '@mui/material/Box'
import SettingsTabs from './Tabs'
import { VehicleAppSettings } from './VehicleAppSettings'
import { useState } from 'react'
import { VehicleSettings } from './VehicleSettings'
import { AudioLevels } from './AudioLevels'
import { Climate } from './Climate'
import AudioSettings from '../mediaComponents/Amplifier/AudioSettings'
import MostSettings from './MostSettings'
import { useMostSettings } from '../../store/store'
import { useEffect } from 'react'

export function Settings() {
  const [page, setPage] = useState('vehicleAppSettings')
  const [settings] = useMostSettings((state) => [state])

  const [actualSettings, setActualSettings] = useState({
    usb: false,
    ip: '',
    manualIp: false,
    usbSettings: {
      version: '',
      standalone: false,
      autoShutdown: false,
      customShutdown: false,
      auxPower: false,
      forty8Khz: false,
      spare3: false,
      spare4: false,
      spare5: false,
      nodeAddressHigh: 0,
      nodeAddressLow: 0,
      groupAddress: 0,
      shutdownTimeDelay: 0,
      startupTimeDelay: 0,
      customShutdownMessage: {
        fblockId: 0,
        fktId: 0,
        optype: 0,
        data: []
      },
      amplifier: {
        fblockId: 0,
        targetAddressHigh: 0,
        targetAddressLow: 0,
        instanceId: 0,
        sinkNumber: 0
      }
    }
  })

  useEffect(() => {
    setActualSettings(settings)
  }, [settings])

  const updateSettings = (key, value) => {
    setActualSettings({ ...actualSettings, [key]: value })
  }

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
      case 'mostSettings':
        return (
          <MostSettings actualSettings={actualSettings} setActualSettings={setActualSettings} />
        )
    }
  }

  return (
    <Box className={'mainView'} sx={{ display: 'flex', flexDirection: 'column' }}>
      <SettingsTabs switchPage={setPage}></SettingsTabs>
      {renderPage()}
    </Box>
  )
}
