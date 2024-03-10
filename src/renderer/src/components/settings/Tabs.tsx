import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'

export default function SettingsTabs({ switchPage }) {
  const [value, setValue] = React.useState(1)
  const pages = ['vehicleSettings', 'climate', 'audioLevels', 'audioSettings', 'vehicleAppSettings']

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(newValue)
    switchPage(pages[newValue])
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons={false}
        aria-label="scrollable prevent tabs example"
        indicatorColor={'secondary'}
        textColor="secondary"
      >
        <Tab label="Vehicle" />
        <Tab label="Climate" />
        <Tab label="Audio Levels" />
        <Tab label="Audio Settings" />
        <Tab label="Canbus" />
        <Tab label="Carplay" />
      </Tabs>
    </Box>
  )
}
