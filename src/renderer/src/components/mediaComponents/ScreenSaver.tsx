import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useAudioControlStore } from '../../store/store'

export default function ScreenSaver() {
  const setSource = useAudioControlStore((state) => state.setSource)
  const [time, setTime] = useState(() => new Date())
  useEffect(() => { setSource(null); const timer = setInterval(() => setTime(new Date()), 30_000); return () => clearInterval(timer) }, [])
  return <Box id="screensaver" sx={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', backgroundImage: 'linear-gradient(90deg,rgba(3,7,12,.84),rgba(3,7,12,.2)),url(/wallPaper.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
    <Box sx={{ position: 'absolute', left: 48, bottom: 42 }}><Typography sx={{ fontSize: 70, lineHeight: .95, fontWeight: 200, letterSpacing: -3 }}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography><Typography sx={{ mt: 1.5, ml: .5, fontSize: 15, color: 'rgba(255,255,255,.68)', letterSpacing: 1.2 }}>{time.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}</Typography></Box>
    <Typography sx={{ position: 'absolute', right: 34, bottom: 26, fontSize: 11, color: 'rgba(255,255,255,.45)', letterSpacing: 2 }}>JLR INFOTAINMENT</Typography>
  </Box>
}
