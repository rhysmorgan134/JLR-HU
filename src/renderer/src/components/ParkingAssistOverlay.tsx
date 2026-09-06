import { useEffect, useRef, useState } from 'react'
import { Box, Chip, IconButton, Typography } from '@mui/material'
import VideocamOffRoundedIcon from '@mui/icons-material/VideocamOffRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useCarplayStore, useParkingAssistStore } from '../store/store'

const frontPaths = [
  ['M 82 104 Q 45 99 20 72', 'M 78 91 Q 39 83 14 49', 'M 73 78 Q 35 65 12 25'],
  ['M 84 96 Q 91 62 117 48', 'M 81 82 Q 91 43 117 28', 'M 78 68 Q 88 25 117 9'],
  ['M 123 48 Q 149 62 156 96', 'M 123 28 Q 149 43 159 82', 'M 123 9 Q 152 25 162 68'],
  ['M 158 104 Q 195 99 220 72', 'M 162 91 Q 201 83 226 49', 'M 167 78 Q 205 65 228 25']
]
const rearPaths = [
  ['M 82 256 Q 45 261 20 288', 'M 78 269 Q 39 277 14 311', 'M 73 282 Q 35 295 12 335'],
  ['M 84 264 Q 91 298 117 312', 'M 81 278 Q 91 317 117 332', 'M 78 292 Q 88 335 117 351'],
  ['M 123 312 Q 149 298 156 264', 'M 123 332 Q 149 317 159 278', 'M 123 351 Q 152 335 162 292'],
  ['M 158 256 Q 195 261 220 288', 'M 162 269 Q 201 277 226 311', 'M 167 282 Q 205 295 228 335']
]

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
        <path d="M87 99 Q91 78 120 72 Q149 78 153 99 L161 126 Q166 156 164 210 L159 253 Q151 281 120 287 Q89 281 81 253 L76 210 Q74 156 79 126 Z" fill="url(#car-body)" stroke="rgba(214,232,248,.62)" strokeWidth="2" />
        <path d="M91 111 Q120 91 149 111 L145 157 Q120 164 95 157 Z" fill="rgba(3,8,14,.9)" stroke="rgba(189,221,255,.24)" />
        <path d="M95 202 Q120 196 145 202 L150 249 Q120 267 90 249 Z" fill="rgba(3,8,14,.84)" stroke="rgba(189,221,255,.2)" />
        <path d="M94 166 Q120 171 146 166 L145 194 Q120 189 95 194 Z" fill="rgba(103,216,255,.07)" stroke="rgba(189,221,255,.12)" />
        <path d="M79 129 L69 138 L68 174 L76 180 M161 129 L171 138 L172 174 L164 180 M78 218 L69 224 L70 254 L82 260 M162 218 L171 224 L170 254 L158 260" fill="none" stroke="rgba(196,219,239,.48)" strokeWidth="5" strokeLinecap="round" />
        <path d="M99 87 Q120 79 141 87" fill="none" stroke="#67d8ff" strokeWidth="2.5" opacity=".9" />
        <path d="M101 274 Q120 280 139 274" fill="none" stroke="#d73948" strokeWidth="2" opacity=".75" />
        <text x="120" y="184" textAnchor="middle" fill="rgba(225,238,249,.68)" fontSize="9" fontWeight="700" letterSpacing="2">XF</text>
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
