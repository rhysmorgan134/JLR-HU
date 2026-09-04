import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import GraphicEqRoundedIcon from '@mui/icons-material/GraphicEqRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import HubRoundedIcon from '@mui/icons-material/HubRounded'
import UsbRoundedIcon from '@mui/icons-material/UsbRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import AppSettingsAltRoundedIcon from '@mui/icons-material/AppSettingsAltRounded'
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded'

const sections = [
  { path: '/settings/audio', title: 'Audio', detail: 'Tone, balance and listening modes', icon: GraphicEqRoundedIcon },
  { path: '/settings/climate', title: 'Climate', detail: 'Heating and ventilation controls', icon: TuneRoundedIcon },
  { path: '/settings/app', title: 'Application', detail: 'Display and system preferences', icon: AppSettingsAltRoundedIcon },
  { path: '/settings/car', title: 'Vehicle', detail: 'Security and convenience settings', icon: DirectionsCarRoundedIcon },
  { path: '/settings/most', title: 'MOST diagnostics', detail: 'Registry, subscriptions and messages', icon: HubRoundedIcon },
  { path: '/settings/pimost-usb', title: 'PiMOST USB', detail: 'Interface and node configuration', icon: UsbRoundedIcon },
  { path: '/settings/update', title: 'Software update', detail: 'Updates and system restart', icon: SystemUpdateAltRoundedIcon }
]

export default function SettingsHub() {
  const navigate = useNavigate()
  return <Box sx={{ height: '100%', p: 1.5, display: 'grid', gridTemplateRows: '48px minmax(0,1fr)', gap: 1.5, overflow: 'hidden' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}><Box className="settings-back" onClick={() => navigate('/home')}><ArrowBackRoundedIcon /></Box><Box><Typography sx={{ fontSize: 24, fontWeight: 600 }}>Settings</Typography><Typography sx={{ mt: -.3, fontSize: 11, color: 'text.secondary', letterSpacing: 1.2 }}>SYSTEM &amp; VEHICLE</Typography></Box></Box>
    <Box sx={{ minHeight: 0, display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gridAutoRows: 'minmax(0,1fr)', gap: 1.2 }}>
      {sections.map(({ path, title, detail, icon: Icon }) => <Box key={path} className="glass-panel touch-card" onClick={() => navigate(path)} sx={{ borderRadius: 3, p: 1.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1.2, minWidth: 0 }}><Box sx={{ width: 46, height: 46, flex: '0 0 auto', borderRadius: 2.2, display: 'grid', placeItems: 'center', color: 'primary.main', background: 'var(--accent-soft)' }}><Icon sx={{ fontSize: 25 }} /></Box><Box sx={{ minWidth: 0, flex: 1 }}><Typography sx={{ fontSize: 19, fontWeight: 600 }}>{title}</Typography><Typography noWrap sx={{ color: 'text.secondary', fontSize: 12 }}>{detail}</Typography></Box><ChevronRightRoundedIcon sx={{ color: 'text.secondary' }} /></Box>)}
    </Box>
  </Box>
}
