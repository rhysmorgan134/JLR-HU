import { Box, Typography } from '@mui/material'
import GraphicEqRoundedIcon from '@mui/icons-material/GraphicEqRounded'
import { useDabTunerStore } from '../../../store/store'

export default function DabOverview() {
  const state = useDabTunerStore()
  const services = Object.values(state.services).filter((service) => service.name)
  const station = services[0]?.name || 'DAB Radio'

  return <Box sx={{ height: '100%', px: 2, display: 'flex', alignItems: 'center', gap: 1.6 }}>
    <Box sx={{ width: 46, height: 46, borderRadius: '50%', display: 'grid', placeItems: 'center', color: 'primary.main', background: 'var(--accent-soft)' }}><GraphicEqRoundedIcon /></Box>
    <Box sx={{ minWidth: 0 }}><Typography sx={{ fontSize: 10.5, color: 'primary.main', fontWeight: 700, letterSpacing: 1.5 }}>DIGITAL RADIO</Typography><Typography noWrap sx={{ fontSize: 20, fontWeight: 600 }}>{station}</Typography><Typography noWrap sx={{ fontSize: 11.5, color: 'text.secondary' }}>{state.scanning ? `Scanning · ${state.scanProgress ?? 0}%` : state.radioText || `${services.length} services available`}</Typography></Box>
  </Box>
}
