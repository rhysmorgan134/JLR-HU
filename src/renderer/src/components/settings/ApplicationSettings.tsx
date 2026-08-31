import { Box, Switch, Typography } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import BugReportRoundedIcon from '@mui/icons-material/BugReportRounded'
import { useNavigate } from 'react-router-dom'
import { useCarplayStore, useMostOperatingModeStore } from '../../store/store'

export default function ApplicationSettings() {
  const navigate = useNavigate()
  const { headUnit } = useMostOperatingModeStore()
  const settings = useCarplayStore((state) => state.settings)
  const saveSettings = useCarplayStore((state) => state.saveSettings)
  const setDiagnosticMode = (enabled: boolean) => {
    if (settings) saveSettings({ ...settings, diagnosticMode: enabled })
  }
  return <Box sx={{ height: '100%', p: 1.5, display: 'grid', gridTemplateRows: '48px minmax(0,1fr)', gap: 1.2, overflow: 'hidden' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}><Box className="settings-back" onClick={() => navigate('/settings')}><ArrowBackRoundedIcon /></Box><Box><Typography sx={{ fontSize: 24, fontWeight: 600 }}>Application settings</Typography><Typography sx={{ mt: -.4, color: 'text.secondary', fontSize: 11, letterSpacing: 1.2 }}>SYSTEM BEHAVIOUR</Typography></Box></Box>
    <Box className="glass-panel" sx={{ minHeight: 0, borderRadius: 3, p: 2, display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
      <Box sx={{ width: 48, height: 48, flex: '0 0 auto', borderRadius: 2.2, display: 'grid', placeItems: 'center', color: 'primary.main', background: 'var(--accent-soft)' }}><BugReportRoundedIcon /></Box>
      <Box sx={{ flex: 1 }}><Typography sx={{ fontSize: 18, fontWeight: 600 }}>Diagnostics-only mode</Typography><Typography sx={{ mt: .5, maxWidth: 520, fontSize: 12.5, color: 'text.secondary' }}>Stops this application acting as the vehicle head unit. MOST traffic remains visible and registry, subscriptions, manual messages, logs, USB settings and firmware tools stay available.</Typography><Typography sx={{ mt: 1.2, fontSize: 11, color: 'text.secondary' }}>Current mode: {headUnit ? 'Head unit' : 'Diagnostics only'}</Typography></Box>
      <Switch checked={!headUnit} disabled={!settings} onChange={(_, enabled) => setDiagnosticMode(enabled)} />
    </Box>
  </Box>
}
