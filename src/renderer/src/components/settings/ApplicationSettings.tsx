import { Box, Switch, Typography } from '@mui/material'
import BugReportRoundedIcon from '@mui/icons-material/BugReportRounded'
import { useCarplayStore } from '../../store/store'
import SettingsPage from './SettingsPage'

export default function ApplicationSettings() {
  const settings = useCarplayStore((state) => state.settings)
  const saveSettings = useCarplayStore((state) => state.saveSettings)
  const diagnosticMode = Boolean(settings && 'diagnosticMode' in settings && settings.diagnosticMode)

  return <SettingsPage title="Application settings">
    <Box className="glass-panel" sx={{ height: '100%', borderRadius: 3, p: 2, display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
      <Box sx={{ width: 48, height: 48, borderRadius: 2.2, display: 'grid', placeItems: 'center', color: 'primary.main', background: 'var(--accent-soft)' }}><BugReportRoundedIcon /></Box>
      <Box sx={{ flex: 1 }}><Typography sx={{ fontSize: 18, fontWeight: 600 }}>Diagnostics-only mode</Typography><Typography sx={{ mt: .5, maxWidth: 540, fontSize: 12.5, color: 'text.secondary' }}>Stops the application acting as the head unit while retaining MOST diagnostics and PiMOST configuration.</Typography></Box>
      <Switch checked={diagnosticMode} disabled={!settings} onChange={(_, enabled) => settings && saveSettings({ ...settings, diagnosticMode: enabled } as typeof settings)} />
    </Box>
  </SettingsPage>
}
