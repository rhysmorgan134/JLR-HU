import { Box, Switch, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import MemoryRoundedIcon from '@mui/icons-material/MemoryRounded'
import { useNavigate } from 'react-router-dom'
import { useCanGatewayStore } from '../../store/store'

export function VehicleSettings() {
  const navigate = useNavigate()
  const car = useCanGatewayStore()
  const options = [
    ['Auto relock', car.autoLock, car.setAutoLock], ['Two-stage unlocking', car.twoStageLocking, car.setTwoStageLocking],
    ['Passive arming', car.passiveArming, car.setPassiveArming], ['Alarm sensors', car.alarmSensors, car.setAlarmSensors],
    ['Mirror fold-back', car.mirrorFoldBack, car.setMirrorFoldBack], ['Reverse mirror dip', car.mirrorDip, car.setMirrorDip],
    ['Global window open', car.globalWindowOpen, car.setGlobalWindowOpen], ['Global window close', car.globalWindowClose, car.setGlobalWindowClose]
  ] as const
  return <Box sx={{ height: '100%', minHeight: 0, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 230px', gap: 1.2 }}>
      <Box className="glass-panel" sx={{ borderRadius: 3, p: 1.2, display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: .7, overflow: 'hidden' }}>{options.map(([label, checked, change]) => <Box key={label} sx={{ px: 1.2, minHeight: 48, borderRadius: 2, background: 'rgba(255,255,255,.035)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}><Typography sx={{ fontSize: 13, fontWeight: 500 }}>{label}</Typography><Switch size="small" checked={checked} onChange={(_, value) => change(value)} /></Box>)}</Box>
      <Box sx={{ minHeight: 0, display: 'grid', gridTemplateRows: 'minmax(0,1fr) 70px', gap: 1.2 }}><Box className="glass-panel" sx={{ borderRadius: 3, p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.4, overflow: 'hidden' }}><Box sx={{ width: 42, height: 42, borderRadius: 2, display: 'grid', placeItems: 'center', color: 'primary.main', background: 'var(--accent-soft)' }}><DirectionsCarRoundedIcon /></Box><Box><Typography sx={{ fontSize: 12, color: 'text.secondary', mb: .7 }}>Drive-away locking</Typography><ToggleButtonGroup orientation="vertical" fullWidth exclusive size="small" value={car.driveAwayLocking} onChange={(_, value) => value !== null && car.setDriveAway(value)}><ToggleButton value={0}>Off</ToggleButton><ToggleButton value={1}>5 mph</ToggleButton><ToggleButton value={2}>10 mph</ToggleButton><ToggleButton value={3}>15 mph</ToggleButton></ToggleButtonGroup></Box><Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between' }}><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Outside</Typography><Typography sx={{ fontSize: 13, fontWeight: 600 }}>{car.externalTemp == null ? '—' : `${car.externalTemp.toFixed(1)}°C`}</Typography></Box></Box><Box className="glass-panel" onClick={() => navigate('/settings/car/ccf')} sx={{ borderRadius: 3, px: 1.4, display: 'flex', alignItems: 'center', gap: 1.2, cursor: 'pointer' }}><MemoryRoundedIcon color="primary" /><Box sx={{ minWidth: 0 }}><Typography sx={{ fontSize: 13, fontWeight: 600 }}>MOST CCF</Typography><Typography noWrap sx={{ fontSize: 10.5, color: 'text.secondary' }}>{car.mostCcf.profile}</Typography></Box></Box></Box>
  </Box>
}
