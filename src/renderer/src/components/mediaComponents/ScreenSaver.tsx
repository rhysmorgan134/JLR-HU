import { Box, Typography } from '@mui/material'
import { PointerEvent, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAudioControlStore } from '../../store/store'

export default function ScreenSaver() {
  const setSource = useAudioControlStore((state) => state.setSource)
  const navigate = useNavigate()
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pressOrigin = useRef<{ x: number; y: number } | null>(null)
  const [time, setTime] = useState(() => new Date())
  useEffect(() => { setSource(null); const timer = setInterval(() => setTime(new Date()), 30_000); return () => clearInterval(timer) }, [])
  const cancelLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current)
    longPressTimer.current = null
    pressOrigin.current = null
  }
  const beginLongPress = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    cancelLongPress()
    pressOrigin.current = { x: event.clientX, y: event.clientY }
    longPressTimer.current = setTimeout(() => navigate('/home'), 900)
  }
  const trackLongPress = (event: PointerEvent<HTMLDivElement>) => {
    if (!pressOrigin.current) return
    if (Math.hypot(event.clientX - pressOrigin.current.x, event.clientY - pressOrigin.current.y) > 15) cancelLongPress()
  }
  useEffect(() => cancelLongPress, [])
  return <Box id="screensaver" onPointerDown={beginLongPress} onPointerMove={trackLongPress} onPointerUp={cancelLongPress} onPointerCancel={cancelLongPress} onContextMenu={(event) => event.preventDefault()} sx={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', touchAction: 'none', userSelect: 'none', cursor: 'pointer', backgroundImage: 'linear-gradient(90deg,rgba(3,7,12,.84),rgba(3,7,12,.2)),url(/wallPaper.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
    <Box sx={{ position: 'absolute', left: 48, bottom: 42 }}><Typography sx={{ fontSize: 70, lineHeight: .95, fontWeight: 200, letterSpacing: -3 }}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography><Typography sx={{ mt: 1.5, ml: .5, fontSize: 15, color: 'rgba(255,255,255,.68)', letterSpacing: 1.2 }}>{time.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}</Typography></Box>
    <Typography sx={{ position: 'absolute', right: 34, bottom: 26, fontSize: 11, color: 'rgba(255,255,255,.45)', letterSpacing: 2 }}>JLR INFOTAINMENT</Typography>
    <Typography sx={{ position: 'absolute', right: 34, top: 28, fontSize: 9, color: 'rgba(255,255,255,.34)', letterSpacing: 1.4 }}>HOLD TO WAKE</Typography>
  </Box>
}
