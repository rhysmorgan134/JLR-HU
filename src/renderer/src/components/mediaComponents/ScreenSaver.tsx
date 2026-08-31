import { Box, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAudioControlStore, useHMIStore } from '../../store/store'

const HOLD_DURATION = 900

export default function ScreenSaver() {
  const setSource = useAudioControlStore((state) => state.setSource)
  const navigate = useNavigate()
  const [time, setTime] = useState(() => new Date())
  const [holding, setHolding] = useState(false)
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current)
    holdTimer.current = null
    setHolding(false)
  }

  const beginHold = (event: React.PointerEvent<HTMLDivElement>) => {
    if (holdTimer.current) return
    event.currentTarget.setPointerCapture(event.pointerId)
    setHolding(true)
    holdTimer.current = setTimeout(() => {
      holdTimer.current = null
      useHMIStore.setState({ screensaver: false })
      navigate('/home')
    }, HOLD_DURATION)
  }

  useEffect(() => {
    setSource(null)
    const timer = setInterval(() => setTime(new Date()), 30_000)
    return () => {
      clearInterval(timer)
      if (holdTimer.current) clearTimeout(holdTimer.current)
    }
  }, [])

  return <Box id="screensaver" onPointerDown={beginHold} onPointerUp={cancelHold} onPointerCancel={cancelHold} onContextMenu={(event) => event.preventDefault()} sx={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', touchAction: 'none', userSelect: 'none', cursor: 'pointer', backgroundImage: 'linear-gradient(90deg,rgba(3,7,12,.84),rgba(3,7,12,.2)),url(/wallPaper.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
    <Box sx={{ position: 'absolute', left: 48, bottom: 42 }}><Typography sx={{ fontSize: 70, lineHeight: .95, fontWeight: 200, letterSpacing: -3 }}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography><Typography sx={{ mt: 1.5, ml: .5, fontSize: 15, color: 'rgba(255,255,255,.68)', letterSpacing: 1.2 }}>{time.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}</Typography></Box>
    <Box sx={{ position: 'absolute', right: 34, bottom: 24, width: 180, textAlign: 'right' }}><Typography sx={{ fontSize: 10, color: holding ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.45)', letterSpacing: 1.7 }}>PRESS AND HOLD TO START</Typography><Box sx={{ mt: .7, ml: 'auto', width: 150, height: 2, overflow: 'hidden', borderRadius: 2, background: 'rgba(255,255,255,.16)' }}><Box key={holding ? 'holding' : 'idle'} sx={{ width: holding ? '100%' : 0, height: '100%', background: 'primary.main', transition: holding ? `width ${HOLD_DURATION}ms linear` : 'none' }} /></Box></Box>
  </Box>
}
