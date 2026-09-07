import { Box, Switch, Typography } from '@mui/material'
import BugReportRoundedIcon from '@mui/icons-material/BugReportRounded'
import { useCarplayStore } from '../../store/store'
import SettingsPage from './SettingsPage'
import { LOGGER_NAMES, loggerEnabledByDefault } from '../../../../main/Globals'

const loggerLabels: Partial<Record<(typeof LOGGER_NAMES)[number], string>> = {
  PimostMain: 'PiMOST main',
  SubscriptionManager: 'Subscriptions',
  MostDiagnosticsBackend: 'MOST diagnostics',
  MostTraffic: 'All MOST traffic',
  PiMostFirmwareBackend: 'PiMOST firmware',
  AudioControl: 'Audio control',
  AudioDiskPlayer: 'CD player',
  AmFmTuner: 'AM/FM tuner',
  CanGateway: 'CAN gateway'
}

export default function ApplicationSettings() {
  const settings = useCarplayStore((state) => state.settings)
  const saveSettings = useCarplayStore((state) => state.saveSettings)
  const diagnosticMode = Boolean(settings && 'diagnosticMode' in settings && settings.diagnosticMode)
  const loggerConfig = settings?.loggerConfig || {}
  const setLoggerEnabled = (name: (typeof LOGGER_NAMES)[number], enabled: boolean) => {
    if (!settings) return
    saveSettings({ ...settings, loggerConfig: { ...loggerConfig, [name]: enabled } })
  }

  return <SettingsPage title="Application settings">
    <Box sx={{ height: '100%', display: 'grid', gridTemplateRows: '68px 68px minmax(0,1fr)', gap: 1 }}>
      <Box sx={{ borderRadius: 2, px: 1.4, display: 'flex', alignItems: 'center', gap: 1.2, background: 'rgba(255,255,255,.035)' }}>
        <Box sx={{ width: 40, height: 40, borderRadius: 2, display: 'grid', placeItems: 'center', color: 'primary.main', background: 'var(--accent-soft)' }}><BugReportRoundedIcon /></Box>
        <Box sx={{ flex: 1 }}><Typography sx={{ fontSize: 15, fontWeight: 600 }}>Diagnostics-only mode</Typography><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Disable head-unit behaviour while retaining MOST tools.</Typography></Box>
        <Switch checked={diagnosticMode} disabled={!settings} onChange={(_, enabled) => settings && saveSettings({ ...settings, diagnosticMode: enabled } as typeof settings)} />
      </Box>
      <Box sx={{ borderRadius: 2, px: 1.4, display: 'flex', alignItems: 'center', gap: 1.2, background: 'rgba(255,255,255,.035)' }}>
        <Box sx={{ flex: 1 }}><Typography sx={{ fontSize: 15, fontWeight: 600 }}>MOST failure alerts</Typography><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Show a toast when a subscription fails or a MOST request returns an error.</Typography></Box>
        <Switch checked={settings?.showErrorToasts !== false} disabled={!settings} onChange={(_, enabled) => settings && saveSettings({ ...settings, showErrorToasts: enabled })} />
      </Box>
      <Box sx={{ minHeight: 0 }}>
        <Typography sx={{ mb: .6, fontSize: 10.5, fontWeight: 700, letterSpacing: 1.2, color: 'text.secondary' }}>CLASS LOGGING</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: .5 }}>
          {LOGGER_NAMES.map((name) => <Box key={name} sx={{ minWidth: 0, height: 36, px: .8, borderRadius: 1.4, display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,.035)' }}><Typography noWrap sx={{ flex: 1, fontSize: 11, fontWeight: 500 }}>{loggerLabels[name] || name}</Typography><Switch size="small" checked={loggerConfig[name] ?? loggerEnabledByDefault(name)} disabled={!settings} onChange={(_, enabled) => setLoggerEnabled(name, enabled)} /></Box>)}
        </Box>
      </Box>
    </Box>
  </SettingsPage>
}
