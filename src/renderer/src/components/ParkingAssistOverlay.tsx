import { useEffect, useRef, useState } from 'react'
import { Box, Chip, IconButton, Typography } from '@mui/material'
import VideocamOffRoundedIcon from '@mui/icons-material/VideocamOffRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useCarplayStore, useParkingAssistStore } from '../store/store'

const frontPaths = [
  ['M 78 77 Q 42 65 26 39', 'M 82 65 Q 51 54 38 33', 'M 88 53 Q 62 45 53 26'],
  ['M 82 77 Q 92 51 117 39', 'M 88 66 Q 98 48 119 40', 'M 96 55 Q 105 44 120 42'],
  ['M 123 39 Q 148 51 158 77', 'M 121 40 Q 142 48 152 66', 'M 120 42 Q 135 44 144 55'],
  ['M 162 77 Q 198 65 214 39', 'M 158 65 Q 189 54 202 33', 'M 152 53 Q 178 45 187 26']
]
const rearPaths = frontPaths.map((sensor) => sensor.map((path) => {
  let coordinateIndex = 0
  return path.replace(/\d+/g, (match) => {
    const isYCoordinate = coordinateIndex++ % 2 === 1
    return isYCoordinate ? String(360 - Number(match)) : match
  })
}))

function RadarSensor({ value, paths }: { value: number; paths: string[] }) {
  const levels = [value >= 24, value >= 14, value > 0]
  const colours = ['#ff4d55', '#ffb547', '#63e2a7']
  return <>{paths.map((path, index) => <path key={path} d={path} fill="none" stroke={levels[index] ? colours[index] : 'rgba(190,216,235,.12)'} strokeWidth={levels[index] ? 7 : 3} strokeLinecap="round" opacity={levels[index] ? .98 : .7} filter={levels[index] ? `url(#glow-${index})` : undefined} />)}</>
}

function ParkingRadar({ front, rear }: { front: number[]; rear: number[] }) {
  return <Box sx={{ width: '100%', height: '100%', minHeight: 245, display: 'grid', placeItems: 'center' }}>
    <svg viewBox="0 0 240 360" width="100%" height="100%" aria-label="Parking sensor radar">
      <defs>
        <filter id="glow-0" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="glow-1" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="glow-2" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <linearGradient id="car-body" x1="0" x2="1"><stop stopColor="#172330" /><stop offset=".48" stopColor="#4a6177" /><stop offset="1" stopColor="#172330" /></linearGradient>
      </defs>
      <text x="120" y="15" textAnchor="middle" fill="rgba(189,221,255,.45)" fontSize="9" letterSpacing="2">FRONT</text>
      {front.map((value, index) => <RadarSensor key={`front-${index}`} value={value} paths={frontPaths[index]} />)}
      {rear.map((value, index) => <RadarSensor key={`rear-${index}`} value={value} paths={rearPaths[index]} />)}
      <g>
        <path d="M87 91 Q120 75 153 91 L163 119 L163 246 Q157 275 120 282 Q83 275 77 246 L77 119 Z" fill="url(#car-body)" stroke="rgba(214,232,248,.55)" strokeWidth="2" />
        <path d="M91 112 Q120 98 149 112 L145 159 L95 159 Z" fill="rgba(4,9,15,.82)" stroke="rgba(189,221,255,.2)" />
        <path d="M94 207 L146 207 L150 251 Q120 264 90 251 Z" fill="rgba(4,9,15,.75)" stroke="rgba(189,221,255,.16)" />
        <path d="M94 169 L146 169 L146 197 L94 197 Z" fill="rgba(103,216,255,.055)" stroke="rgba(189,221,255,.1)" />
        <path d="M78 129 L70 137 L70 175 L78 178 M162 129 L170 137 L170 175 L162 178 M78 218 L70 222 L70 252 L80 256 M162 218 L170 222 L170 252 L160 256" fill="none" stroke="rgba(196,219,239,.4)" strokeWidth="5" strokeLinecap="round" />
        <line x1="102" y1="87" x2="138" y2="87" stroke="#67d8ff" strokeWidth="2" opacity=".8" />
      </g>
      <text x="120" y="350" textAnchor="middle" fill="rgba(189,221,255,.45)" fontSize="9" letterSpacing="2">REAR</text>
    </svg>
  </Box>
}

export default function ParkingAssistOverlay() {
  const [reverse, settings] = useCarplayStore((state) => [state.reverse, state.settings])
  const { parkingSensors: sensors, parkingActive, manualOpen, setManualOpen } = useParkingAssistStore()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraError, setCameraError] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const active = reverse || parkingActive || manualOpen

  useEffect(() => {
    if (!active) setDismissed(false)
  }, [active])

  useEffect(() => {
    if (!active || dismissed) return
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
  }, [active, dismissed, settings?.camera])

  if (!active || dismissed) return null
  const front = [sensors.frontLeft, sensors.frontCentreLeft, sensors.frontCentreRight, sensors.frontRight]
  const rear = [sensors.rearLeft, sensors.rearCentreLeft, sensors.rearCentreRight, sensors.rearRight]

  return <Box sx={{ position: 'fixed', inset: 0, zIndex: 2500, p: 1.25, display: 'grid', gridTemplateColumns: 'minmax(0,1.65fr) minmax(250px,.75fr)', gap: 1.25, overflow: 'hidden', background: '#05090f' }}>
    <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 2.5, border: '1px solid rgba(189,221,255,.18)', background: 'radial-gradient(circle at center,#182331,#080d14)' }}>
      <video ref={videoRef} muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: cameraError ? 'none' : 'block' }} />
      {cameraError ? <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'text.secondary' }}><Box sx={{ textAlign: 'center' }}><VideocamOffRoundedIcon sx={{ fontSize: 44 }} /><Typography sx={{ mt: 1, fontSize: 14 }}>Reverse camera unavailable</Typography><Typography sx={{ fontSize: 11 }}>Select a camera in app settings</Typography></Box></Box> : null}
      <Chip label={reverse ? 'REVERSE CAMERA' : 'PARKING ASSIST'} size="small" sx={{ position: 'absolute', top: 12, left: 12, fontSize: 10, letterSpacing: 1.2, background: 'rgba(5,9,15,.72)', backdropFilter: 'blur(8px)' }} />
      <IconButton aria-label="Close parking assist" onClick={() => { setManualOpen(false); setDismissed(true) }} sx={{ position: 'absolute', top: 10, right: 10, width: 38, height: 38, color: 'white', background: 'rgba(5,9,15,.72)', backdropFilter: 'blur(8px)', '&:hover': { background: 'rgba(5,9,15,.86)' } }}><CloseRoundedIcon /></IconButton>
      <Box sx={{ position: 'absolute', left: '20%', right: '20%', bottom: 12, height: 100, borderLeft: '2px solid rgba(103,216,255,.5)', borderRight: '2px solid rgba(103,216,255,.5)', transform: 'perspective(180px) rotateX(30deg)', opacity: .75 }} />
    </Box>
    <Box className="glass-panel" sx={{ minHeight: 0, borderRadius: 2.5, p: 1.5, display: 'grid', gridTemplateRows: 'auto minmax(0,1fr) auto', gap: .5, background: 'radial-gradient(circle at 50% 48%,rgba(31,55,73,.7),rgba(10,16,24,.94) 68%)' }}>
      <Box><Typography sx={{ fontSize: 11, color: 'primary.main', letterSpacing: 1.6, fontWeight: 700 }}>PARKING ASSIST</Typography><Typography sx={{ fontSize: 18, fontWeight: 600 }}>Obstacle overview</Typography></Box>
      <ParkingRadar front={front} rear={rear} />
      <Typography sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 10.5 }}>{Math.max(...front, ...rear) >= 24 ? 'STOP · Obstacle very close' : 'Check surroundings before moving'}</Typography>
    </Box>
  </Box>
}
