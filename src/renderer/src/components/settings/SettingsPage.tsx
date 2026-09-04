import { Box, Typography } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { useNavigate } from 'react-router-dom'

export default function SettingsPage({ title, children }: { title: string; children: React.ReactNode }) {
  const navigate = useNavigate()
  return <Box sx={{ height: '100%', p: 1.5, display: 'grid', gridTemplateRows: '48px minmax(0,1fr)', gap: 1.2, overflow: 'hidden' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}><Box className="settings-back" onClick={() => navigate('/settings')}><ArrowBackRoundedIcon /></Box><Typography sx={{ fontSize: 24, fontWeight: 600 }}>{title}</Typography></Box>
    <Box className="glass-panel" sx={{ minHeight: 0, borderRadius: 3, p: 1.5, overflow: 'hidden' }}>{children}</Box>
  </Box>
}
