import { useEffect, useRef, useState } from 'react'
import { Box, Chip, IconButton, Typography } from '@mui/material'
import VideocamOffRoundedIcon from '@mui/icons-material/VideocamOffRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useCarplayStore, useParkingAssistStore } from '../store/store'

const sensorNames = [
  'frontLeft', 'frontCentreLeft', 'frontCentreRight', 'frontRight',
  'rearLeft', 'rearCentreLeft', 'rearCentreRight', 'rearRight'
] as const

function ParkingRadar() {
  const sensors = useParkingAssistStore((state) => state.parkingSensors)
  return <Box sx={{ minHeight: 0, display: 'grid', gridTemplateRows: '1fr 150px 1fr', gap: .5 }}>
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', alignItems: 'end', gap: 1 }}>
      {sensorNames.slice(0, 4).map((name) => <Radar key={name} value={sensors[name]} />)}
    </Box>
    <Box sx={{ width: 92, justifySelf: 'center', borderRadius: '42% 42% 28% 28%', border: '2px solid rgba(214,232,248,.5)', background: 'linear-gradient(90deg,#172330,#4a6177,#172330)', boxShadow: '0 0 30px rgba(103,216,255,.12)' }} />
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', alignItems: 'start', gap: 1 }}>
      {sensorNames.slice(4).map((name) => <Radar key={name} value={sensors[name]} reverse />)}
    </Box>
  </Box>
}

function Radar({ value, reverse = false }: { value: number; reverse?: boolean }) {
  const colour = value >= 24 ? '#ff4d55' : value >= 14 ? '#ffb547' : value > 0 ? '#63e2a7' : 'rgba(190,216,235,.12)'
  return <Box sx={{ height: Math.max(8, Math.min(54, value * 2)), borderRadius: reverse ? '4px 4px 20px 20px' : '20px 20px 4px 4px', border: `3px solid ${colour}`, boxShadow: value > 0 ? `0 0 14px ${colour}` : 'none', opacity: value > 0 ? 1 : .55 }} />
}

export default function ParkingAssistOverlay() {
  const [reverse, settings] = useCarplayStore((state) => [state.reverse, state.settings])
  const { parkingActive, manualOpen, setManualOpen } = useParkingAssistStore()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraError, setCameraError] = useState(false)
  const active = reverse || parkingActive || manualOpen

  useEffect(() => {
    if (!active) return
    let stream: MediaStream | null = null
    setCameraError(false)
    navigator.mediaDevices.getUserMedia({
      video: settings?.camera
        ? { deviceId: { exact: settings.camera }, width: { ideal: 800 }, height: { ideal: 480 } }
        : { facingMode: { ideal: 'environment' }, width: { ideal: 800 }, height: { ideal: 480 } },
      audio: false
    }).then((result) => {
      stream = result
      if (videoRef.current) {
        videoRef.current.srcObject = result
        videoRef.current.play().catch(() => undefined)
      }
    }).catch(() => setCameraError(true))
    return () => stream?.getTracks().forEach((track) => track.stop())
  }, [active, settings?.camera])

  if (!active) return null
  return <Box sx={{ position: 'fixed', inset: 0, zIndex: 2500, p: 1.25, display: 'grid', gridTemplateColumns: 'minmax(0,1.65fr) minmax(230px,.75fr)', gap: 1.25, overflow: 'hidden', background: '#05090f' }}>
    <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 2.5, border: '1px solid rgba(189,221,255,.18)', background: '#080d14' }}>
      <video ref={videoRef} muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: cameraError ? 'none' : 'block' }} />
      {cameraError && <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'text.secondary', textAlign: 'center' }}><Box><VideocamOffRoundedIcon sx={{ fontSize: 44 }} /><Typography>Reverse camera unavailable</Typography></Box></Box>}
      <Chip label={reverse ? 'REVERSE CAMERA' : 'PARKING ASSIST'} size="small" sx={{ position: 'absolute', top: 12, left: 12 }} />
      {manualOpen && <IconButton onClick={() => setManualOpen(false)} sx={{ position: 'absolute', top: 8, right: 8, color: 'white', background: 'rgba(5,9,15,.72)' }}><CloseRoundedIcon /></IconButton>}
    </Box>
    <Box className="glass-panel" sx={{ minHeight: 0, borderRadius: 2.5, p: 1.5, display: 'grid', gridTemplateRows: 'auto minmax(0,1fr) auto', gap: .5 }}>
      <Box><Typography sx={{ fontSize: 11, color: 'primary.main', letterSpacing: 1.6, fontWeight: 700 }}>PARKING ASSIST</Typography><Typography sx={{ fontSize: 18, fontWeight: 600 }}>Obstacle overview</Typography></Box>
      <ParkingRadar />
      <Typography sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 10.5 }}>Check surroundings before moving</Typography>
    </Box>
  </Box>
}
