import { Box, Button, Switch, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import { useEffect, useState } from 'react'
import { useCanGatewayStore, useCarplayStore, socket } from '../../store/store'
import SettingsPage from './SettingsPage'

export default function TimeSettings() {
  const settings = useCarplayStore((state) => state.settings)
  const saveSettings = useCarplayStore((state) => state.saveSettings)
  const [mostHours, mostMinutes, most24Hour] = useCanGatewayStore((state) => [
    state.hours,
    state.minutes,
    state.uses24HourClock
  ])
  const [hours, setHours] = useState(new Date().getHours())
  const [minutes, setMinutes] = useState(new Date().getMinutes())
  const [uses24HourClock, setUses24HourClock] = useState(most24Hour ?? true)
  const automatic = settings?.autoTimeSync !== false

  useEffect(() => {
    if (mostHours !== null) setHours(mostHours)
    if (mostMinutes !== null) setMinutes(mostMinutes)
    if (most24Hour !== null) setUses24HourClock(most24Hour)
  }, [mostHours, mostMinutes, most24Hour])

  const setAutomatic = (enabled: boolean) => {
    if (settings) saveSettings({ ...settings, autoTimeSync: enabled })
  }
  const apply = () => socket.emit('button', {
    device: 'canGateway',
    function: 'setManualClock',
    args: { hours, minutes, uses24HourClock }
  })

  return <SettingsPage title="Time settings">
    <Box sx={{ height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.2 }}>
      <Box sx={{ p: 2, borderRadius: 2.5, background: 'rgba(255,255,255,.035)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}><AccessTimeRoundedIcon color="primary" /><Box sx={{ flex: 1 }}><Typography sx={{ fontWeight: 650 }}>Set automatically</Typography><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Synchronise MOST time with network time when online.</Typography></Box><Switch checked={automatic} disabled={!settings} onChange={(_, value) => setAutomatic(value)} /></Box>
        <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>MOST time</Typography>
        <Typography sx={{ fontSize: 42, lineHeight: 1, fontWeight: 650, letterSpacing: 2 }}>{mostHours == null || mostMinutes == null ? '--:--' : `${String(mostHours).padStart(2, '0')}:${String(mostMinutes).padStart(2, '0')}`}</Typography>
      </Box>
      <Box sx={{ p: 2, borderRadius: 2.5, background: 'rgba(255,255,255,.035)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1.5, opacity: automatic ? .45 : 1 }}>
        <Typography sx={{ fontWeight: 650 }}>Manual time</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}><TextField label="Hour" type="number" value={hours} disabled={automatic} onChange={(event) => setHours(Math.max(0, Math.min(23, Number(event.target.value))))} inputProps={{ min: 0, max: 23 }} /><TextField label="Minute" type="number" value={minutes} disabled={automatic} onChange={(event) => setMinutes(Math.max(0, Math.min(59, Number(event.target.value))))} inputProps={{ min: 0, max: 59 }} /></Box>
        <ToggleButtonGroup fullWidth exclusive value={uses24HourClock} disabled={automatic} onChange={(_, value) => value !== null && setUses24HourClock(value)}><ToggleButton value={false}>12 hour</ToggleButton><ToggleButton value={true}>24 hour</ToggleButton></ToggleButtonGroup>
        <Button variant="contained" disabled={automatic} onClick={apply}>Set MOST time</Button>
      </Box>
    </Box>
  </SettingsPage>
}
