import { Box, Typography } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAudioControlStore, useHMIStore } from '../../store/store'

export default function Header() {
  const screensaver = useHMIStore((state) => state.screensaver)
  const currentSource = useAudioControlStore((state) => state.currentSource)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [time, setTime] = useState(() => new Date())
  useEffect(() => { const timer = setInterval(() => setTime(new Date()), 30_000); return () => clearInterval(timer) }, [])
  useEffect(() => { if (screensaver) navigate('/'); else if (pathname === '/') navigate('/home') }, [screensaver])
  const sourceLabel = currentSource === 'AmFmTuner' ? 'Radio' : currentSource === 'AudioDiskPlayer' ? 'CD Player' : currentSource === 'Carplay' ? 'Apple CarPlay' : 'Audio off'
  if (pathname === '/') return null
  return <Box sx={{ height: 42, px: 2.25, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(189,221,255,.09)', background: 'rgba(5,9,14,.76)', backdropFilter: 'blur(16px)' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CircleIcon sx={{ fontSize: 8, color: currentSource ? '#65e2a8' : '#6b7480', filter: 'drop-shadow(0 0 6px currentColor)' }} /><Typography sx={{ fontSize: 13, fontWeight: 500, color: 'text.secondary', letterSpacing: .3 }}>{sourceLabel}</Typography></Box>
    <Typography sx={{ fontSize: 15, fontWeight: 600, letterSpacing: 1.1 }}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
    <Typography sx={{ fontSize: 12, color: 'text.secondary', letterSpacing: .5 }}>JLR · MOST</Typography>
  </Box>
}
