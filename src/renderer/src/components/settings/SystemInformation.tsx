import { Box, Button, Chip, IconButton, Typography } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ComputerRoundedIcon from '@mui/icons-material/ComputerRounded'
import LanRoundedIcon from '@mui/icons-material/LanRounded'
import PublicRoundedIcon from '@mui/icons-material/PublicRounded'
import MemoryRoundedIcon from '@mui/icons-material/MemoryRounded'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSystemInfoStore } from '../../store/store'

const bytes = (value: number) => value ? `${(value / 1024 ** 3).toFixed(1)} GB` : '—'
const uptime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const days = Math.floor(hours / 24)
  return days ? `${days}d ${hours % 24}h` : `${hours}h ${Math.floor(seconds % 3600 / 60)}m`
}

export default function SystemInformation() {
  const navigate = useNavigate()
  const info = useSystemInfoStore()
  useEffect(() => info.refresh(), [])

  const cards = [
    { icon: ComputerRoundedIcon, title: 'Operating system', rows: [['Platform', `${info.platformName} ${info.release}`], ['Architecture', info.architecture], ['Host name', info.hostname], ['App version', info.appVersion]] },
    { icon: LanRoundedIcon, title: 'Network', rows: [['Interface', info.networkConnected ? 'Connected' : 'Disconnected'], ['IP address', info.ipAddresses.join(', ') || 'Not assigned'], ['Internet', info.internetConnected ? 'Available' : 'Unavailable']] },
    { icon: PublicRoundedIcon, title: 'Locale & clock', rows: [['Locale', info.locale || '—'], ['Time zone', info.timeZone || '—'], ['Clock format', info.uses24HourClock ? '24-hour' : '12-hour'], ['MOST sync', info.internetConnected ? 'Enabled' : 'Waiting for internet']] },
    { icon: MemoryRoundedIcon, title: 'Hardware', rows: [['Processor', info.cpuModel || '—'], ['CPU cores', String(info.cpuCount || '—')], ['CPU temperature', info.cpuTemperature == null ? 'Unavailable' : `${info.cpuTemperature.toFixed(1)}°C`], ['Memory', `${bytes(info.freeMemory)} free / ${bytes(info.totalMemory)}`], ['Uptime', uptime(info.uptimeSeconds)]] }
  ]

  return <Box sx={{ height: '100%', p: 1.5, display: 'grid', gridTemplateRows: '48px minmax(0,1fr)', gap: 1.2, overflow: 'hidden' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}><IconButton aria-label="Back to settings" onClick={() => navigate('/settings')} sx={{ width: 42, height: 42, border: '1px solid var(--stroke)', background: 'rgba(255,255,255,.04)' }}><ArrowBackRoundedIcon /></IconButton><Box><Typography sx={{ fontSize: 23, fontWeight: 600 }}>System information</Typography><Typography sx={{ mt: -.3, fontSize: 10.5, color: 'text.secondary', letterSpacing: 1.2 }}>DEVICE, NETWORK &amp; CLOCK</Typography></Box><Chip size="small" label={info.internetConnected ? 'ONLINE' : info.networkConnected ? 'LOCAL NETWORK' : 'OFFLINE'} color={info.internetConnected ? 'success' : 'default'} sx={{ ml: 'auto', fontSize: 10 }} /><Button size="small" variant="outlined" onClick={info.refresh}>Refresh</Button></Box>
    <Box sx={{ minHeight: 0, display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gridTemplateRows: 'repeat(2,minmax(0,1fr))', gap: 1 }}>
      {cards.map(({ icon: Icon, title, rows }) => <Box key={title} className="glass-panel" sx={{ borderRadius: 3, p: 1.3, minHeight: 0, overflow: 'hidden' }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: .8 }}><Box sx={{ width: 32, height: 32, borderRadius: 1.7, display: 'grid', placeItems: 'center', color: 'primary.main', background: 'var(--accent-soft)' }}><Icon fontSize="small" /></Box><Typography sx={{ fontSize: 14, fontWeight: 700 }}>{title}</Typography></Box>{rows.map(([label, value]) => <Box key={label} sx={{ py: .35, display: 'flex', justifyContent: 'space-between', gap: 1, borderTop: '1px solid rgba(255,255,255,.045)' }}><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{label}</Typography><Typography noWrap sx={{ maxWidth: '68%', fontSize: 11.5, fontWeight: 500 }}>{value}</Typography></Box>)}</Box>)}
    </Box>
  </Box>
}
