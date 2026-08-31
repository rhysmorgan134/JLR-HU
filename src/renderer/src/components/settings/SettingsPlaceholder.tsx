import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded'

const labels = { audio: 'Audio settings', app: 'Application settings', car: 'Vehicle settings' } as const

export default function SettingsPlaceholder({ kind }: { kind: keyof typeof labels }) {
  const navigate = useNavigate()
  return <Box sx={{ height: '100%', p: 1.5, display: 'grid', gridTemplateRows: '48px minmax(0,1fr)', gap: 1.5 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}><Box className="settings-back" onClick={() => navigate('/settings')}><ArrowBackRoundedIcon /></Box><Typography sx={{ fontSize: 24, fontWeight: 600 }}>{labels[kind]}</Typography></Box>
    <Box className="glass-panel" sx={{ minHeight: 0, borderRadius: 3, display: 'grid', placeItems: 'center', textAlign: 'center' }}><Box><ConstructionRoundedIcon sx={{ fontSize: 44, color: 'primary.main', mb: 1 }} /><Typography sx={{ fontSize: 22, fontWeight: 600 }}>Coming soon</Typography><Typography sx={{ color: 'text.secondary', fontSize: 13 }}>This section is ready for its controls and preferences.</Typography></Box></Box>
  </Box>
}
