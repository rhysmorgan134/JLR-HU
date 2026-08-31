import { useEffect, useRef, useState } from 'react'
import { Box, Chip, Typography } from '@mui/material'
import VideocamOffRoundedIcon from '@mui/icons-material/VideocamOffRounded'
import { useCarplayStore, useParkingAssistStore } from '../store/store'

const sensorColour = (value: number) => value >= 24 ? '#ff4d55' : value >= 14 ? '#ffb547' : '#63e2a7'

function Sensor({ value }: { value: number }) {
  const strength = Math.max(0, Math.min(1, value / 31))
  const colour = sensorColour(value)
  return <Box sx={{ height: 22, flex: 1, borderRadius: 1.2, border: '1px solid rgba(255,255,255,.1)', overflow: 'hidden', background: 'rgba(255,255,255,.035)', position: 'relative' }}><Box sx={{ position: 'absolute', inset: 0, transformOrigin: 'bottom', transform: `scaleY(${Math.max(.08, strength)})`, background: colour, opacity: value ? .95 : .12, boxShadow: value ? `0 0 14px ${colour}` : 'none' }} /></Box>
}

export default function ParkingAssistOverlay() {
  const [reverse, settings] = useCarplayStore((state) => [state.reverse, state.settings])
  const { parkingSensors: sensors, parkingActive } = useParkingAssistStore()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraError, setCameraError] = useState(false)
  const active = reverse || parkingActive

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
  const front = [sensors.frontLeft, sensors.frontCentreLeft, sensors.frontCentreRight, sensors.frontRight]
  const rear = [sensors.rearLeft, sensors.rearCentreLeft, sensors.rearCentreRight, sensors.rearRight]

  return <Box sx={{ position: 'fixed', inset: 0, zIndex: 2500, p: 1.25, display: 'grid', gridTemplateColumns: 'minmax(0,1.65fr) minmax(250px,.75fr)', gap: 1.25, overflow: 'hidden', background: '#05090f' }}>
    <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 2.5, border: '1px solid rgba(189,221,255,.18)', background: 'radial-gradient(circle at center,#182331,#080d14)' }}>
      <video ref={videoRef} muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: cameraError ? 'none' : 'block' }} />
      {cameraError ? <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'text.secondary' }}><Box sx={{ textAlign: 'center' }}><VideocamOffRoundedIcon sx={{ fontSize: 44 }} /><Typography sx={{ mt: 1, fontSize: 14 }}>Reverse camera unavailable</Typography><Typography sx={{ fontSize: 11 }}>Select a camera in app settings</Typography></Box></Box> : null}
      <Chip label={reverse ? 'REVERSE CAMERA' : 'PARKING ASSIST'} size="small" sx={{ position: 'absolute', top: 12, left: 12, fontSize: 10, letterSpacing: 1.2, background: 'rgba(5,9,15,.72)', backdropFilter: 'blur(8px)' }} />
      <Box sx={{ position: 'absolute', left: '20%', right: '20%', bottom: 12, height: 100, borderLeft: '2px solid rgba(103,216,255,.5)', borderRight: '2px solid rgba(103,216,255,.5)', transform: 'perspective(180px) rotateX(30deg)', opacity: .75 }} />
    </Box>
    <Box className="glass-panel" sx={{ minHeight: 0, borderRadius: 2.5, p: 1.5, display: 'grid', gridTemplateRows: 'auto auto minmax(0,1fr) auto auto', gap: 1.1 }}>
      <Box><Typography sx={{ fontSize: 11, color: 'primary.main', letterSpacing: 1.6, fontWeight: 700 }}>PARKING ASSIST</Typography><Typography sx={{ fontSize: 18, fontWeight: 600 }}>Obstacle overview</Typography></Box>
      <Box sx={{ display: 'flex', gap: .55 }}>{front.map((value, index) => <Sensor key={`front-${index}`} value={value} />)}</Box>
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 0 }}><Box sx={{ width: 92, height: 180, borderRadius: '38% 38% 26% 26%', position: 'relative', border: '2px solid rgba(210,229,246,.48)', background: 'linear-gradient(90deg,#182330,#34485c 48%,#182330)', boxShadow: 'inset 0 0 22px rgba(103,216,255,.13),0 12px 30px rgba(0,0,0,.4)' }}><Box sx={{ position: 'absolute', left: 13, right: 13, top: 32, height: 48, borderRadius: 2, background: 'rgba(5,10,16,.78)', border: '1px solid rgba(189,221,255,.16)' }} /><Box sx={{ position: 'absolute', left: 13, right: 13, bottom: 28, height: 42, borderRadius: 2, background: 'rgba(5,10,16,.7)', border: '1px solid rgba(189,221,255,.13)' }} /></Box></Box>
      <Box sx={{ display: 'flex', gap: .55 }}>{rear.map((value, index) => <Sensor key={`rear-${index}`} value={value} />)}</Box>
      <Typography sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 10.5 }}>{Math.max(...front, ...rear) >= 24 ? 'STOP · Obstacle very close' : 'Check surroundings before moving'}</Typography>
    </Box>
  </Box>
}
