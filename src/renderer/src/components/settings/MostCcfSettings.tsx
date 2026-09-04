import { Box, Chip, Typography } from '@mui/material'
import MemoryRoundedIcon from '@mui/icons-material/MemoryRounded'
import { useCanGatewayStore } from '../../store/store'
import SettingsPage from './SettingsPage'

const fitted = (value: boolean | null) => value == null ? 'Unknown' : value ? 'Fitted' : 'Not fitted'

export default function MostCcfSettings() {
  const ccf = useCanGatewayStore((state) => state.mostCcf)
  const fields: Array<[string, string]> = [
    ['Audio system', ccf.audioSystem], ['Audio player', ccf.audioPlayer],
    ['Centre speaker', ccf.centreSpeaker], ['Subwoofer', fitted(ccf.subwoofer)],
    ['Digital radio', ccf.digitalRadio], ['Auxiliary input', fitted(ccf.auxInput)],
    ['Microphone', fitted(ccf.microphone)], ['Navigation', ccf.navigation],
    ['Voice control', ccf.voiceControl], ['Steering-wheel audio', fitted(ccf.steeringWheelAudioButtons)]
  ]
  const properties = Object.entries(ccf.properties).map(([key, value]) => `${key.toUpperCase()}=${value.toString(16).padStart(2, '0').toUpperCase()}`).join('  ')

  return <SettingsPage title="MOST CCF">
    <Box sx={{ height: '100%', display: 'grid', gridTemplateRows: '44px minmax(0,1fr) 58px', gap: 1 }}>
      <Box className="glass-panel" sx={{ px: 1.4, borderRadius: 2.5, display: 'flex', alignItems: 'center', gap: 1.2 }}><MemoryRoundedIcon color="primary" /><Typography sx={{ fontSize: 14, fontWeight: 600 }}>{ccf.profile}</Typography><Chip sx={{ ml: 'auto' }} size="small" color={ccf.captured ? 'success' : 'default'} label={ccf.captured ? 'Captured' : 'Waiting'} /></Box>
      <Box className="glass-panel" sx={{ minHeight: 0, p: 1, borderRadius: 3, display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gridTemplateRows: 'repeat(5,minmax(0,1fr))', gap: .55 }}>{fields.map(([label, value]) => <Box key={label} sx={{ px: 1.1, borderRadius: 1.7, background: 'rgba(255,255,255,.035)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}><Typography sx={{ color: 'text.secondary', fontSize: 10.5 }}>{label}</Typography><Typography noWrap sx={{ maxWidth: '68%', fontSize: 11.5, fontWeight: 600 }}>{value}</Typography></Box>)}</Box>
      <Box className="glass-panel" sx={{ px: 1.3, py: .7, borderRadius: 2.5, overflow: 'hidden' }}><Typography noWrap sx={{ fontFamily: 'monospace', fontSize: 10.5 }}>{ccf.raw303 || 'Waiting for F5/303…'}</Typography><Typography noWrap sx={{ color: 'text.secondary', fontFamily: 'monospace', fontSize: 9.5 }}>{properties || ccf.raw302 || 'Waiting for F5/302…'}</Typography></Box>
    </Box>
  </SettingsPage>
}
