import { Box, Switch, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import { useNavigate } from 'react-router-dom'
import { useCanGatewayStore } from '../../store/store'

export function VehicleSettings() {
  const navigate = useNavigate()
  const car = useCanGatewayStore()
  const outsideTemperature = car.externalTemp == null
    ? null
    : car.temperatureUnit === 'fahrenheit'
      ? car.externalTemp * 9 / 5 + 32
      : car.externalTemp
  const options = [
    ['Auto relock', car.autoLock, car.setAutoLock], ['Two-stage unlocking', car.twoStageLocking, car.setTwoStageLocking],
    ['Passive arming', car.passiveArming, car.setPassiveArming], ['Alarm sensors', car.alarmSensors, car.setAlarmSensors],
    ['Mirror fold-back', car.mirrorFoldBack, car.setMirrorFoldBack], ['Reverse mirror dip', car.mirrorDip, car.setMirrorDip],
    ['Global window open', car.globalWindowOpen, car.setGlobalWindowOpen], ['Global window close', car.globalWindowClose, car.setGlobalWindowClose]
  ] as const
  return <Box sx={{ height: '100%', minHeight: 0, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 230px', gap: 1 }}>
      <Box className="glass-panel" sx={{ borderRadius: 3, p: 1.2, display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: .7, overflow: 'hidden' }}>{options.map(([label, checked, change]) => <Box key={label} sx={{ px: 1.2, minHeight: 48, borderRadius: 2, background: 'rgba(255,255,255,.035)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}><Typography sx={{ fontSize: 13, fontWeight: 500 }}>{label}</Typography><Switch size="small" checked={checked} onChange={(_, value) => change(value)} /></Box>)}</Box>
      <Box className="glass-panel" sx={{ minHeight: 0, borderRadius: 3, p: 1, display: 'flex', flexDirection: 'column', gap: .55, overflow: 'hidden' }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 30, height: 30, borderRadius: 1.7, display: 'grid', placeItems: 'center', color: 'primary.main', background: 'var(--accent-soft)' }}><DirectionsCarRoundedIcon fontSize="small" /></Box><Typography sx={{ fontSize: 13, fontWeight: 600 }}>Vehicle preferences</Typography></Box><Box><Typography sx={{ fontSize: 10, color: 'text.secondary', mb: .25 }}>Drive-away locking</Typography><ToggleButtonGroup fullWidth exclusive size="small" value={car.driveAwayLocking} onChange={(_, value) => value !== null && car.setDriveAway(value)}><ToggleButton value={0}>Off</ToggleButton><ToggleButton value={1}>5</ToggleButton><ToggleButton value={2}>10</ToggleButton><ToggleButton value={3}>15</ToggleButton></ToggleButtonGroup></Box><Box><Typography sx={{ fontSize: 10, color: 'text.secondary', mb: .25 }}>Distance</Typography><ToggleButtonGroup fullWidth exclusive size="small" value={car.distanceUnit} onChange={(_, value) => value !== null && car.setDistanceUnit(value)}><ToggleButton value="miles">Miles</ToggleButton><ToggleButton value="kilometres">Km</ToggleButton></ToggleButtonGroup></Box><Box><Typography sx={{ fontSize: 10, color: 'text.secondary', mb: .25 }}>Temperature</Typography><ToggleButtonGroup fullWidth exclusive size="small" value={car.temperatureUnit} onChange={(_, value) => value !== null && car.setTemperatureUnit(value)}><ToggleButton value="fahrenheit">°F</ToggleButton><ToggleButton value="celsius">°C</ToggleButton></ToggleButtonGroup></Box><Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography sx={{ fontSize: 10.5, color: 'text.secondary' }}>Outside</Typography><Typography sx={{ fontSize: 12, fontWeight: 600 }}>{outsideTemperature == null ? '—' : `${outsideTemperature.toFixed(1)}°${car.temperatureUnit === 'fahrenheit' ? 'F' : 'C'}`}</Typography></Box><Box onClick={() => navigate('/settings/car/ccf')} sx={{ mt: 'auto', minHeight: 38, px: 1, borderRadius: 1.7, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,.045)' }}><Box><Typography sx={{ fontSize: 12, fontWeight: 600 }}>MOST CCF</Typography><Typography noWrap sx={{ maxWidth: 150, fontSize: 9.5, color: 'text.secondary' }}>{car.mostCcf.profile}</Typography></Box><Typography color="primary">›</Typography></Box></Box>
  </Box>
}
