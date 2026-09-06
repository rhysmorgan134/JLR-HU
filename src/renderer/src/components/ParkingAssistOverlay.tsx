import { useEffect, useRef, useState } from 'react'
import { Box, Chip, IconButton, Typography } from '@mui/material'
import VideocamOffRoundedIcon from '@mui/icons-material/VideocamOffRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useCarplayStore, useParkingAssistStore } from '../store/store'

const frontPaths = [
  ['M 108 101 L 91 98 Q 82 93 76 85 L 99 73 Q 104 82 112 86 Z', 'M 91 98 Q 82 93 76 85 L 58 68 Q 73 55 91 48 L 99 73 Q 86 78 76 85 Z', 'M 58 68 Q 73 55 91 48 L 83 23 Q 55 33 33 53 Z'],
  ['M 112 86 Q 128 77 150 76 L 150 51 Q 121 52 99 73 Z', 'M 99 73 Q 121 52 150 51 L 150 27 Q 113 28 91 48 Z', 'M 91 48 Q 113 28 150 27 L 150 7 Q 108 7 83 23 Z'],
  ['M 150 76 Q 172 77 188 86 L 201 73 Q 179 52 150 51 Z', 'M 150 51 Q 179 52 201 73 L 209 48 Q 187 28 150 27 Z', 'M 150 27 Q 187 28 209 48 L 217 23 Q 192 7 150 7 Z'],
  ['M 188 86 Q 196 82 201 73 L 224 85 Q 218 93 209 98 L 192 101 Z', 'M 201 73 Q 214 78 224 85 L 242 68 Q 227 55 209 48 Z', 'M 209 48 Q 227 55 242 68 L 267 53 Q 245 33 217 23 Z']
]
const rearPaths = [
  ['M 108 339 L 91 342 Q 82 347 76 355 L 99 367 Q 104 358 112 354 Z', 'M 91 342 Q 82 347 76 355 L 58 372 Q 73 385 91 392 L 99 367 Q 86 362 76 355 Z', 'M 58 372 Q 73 385 91 392 L 83 417 Q 55 407 33 387 Z'],
  ['M 112 354 Q 128 363 150 364 L 150 389 Q 121 388 99 367 Z', 'M 99 367 Q 121 388 150 389 L 150 413 Q 113 412 91 392 Z', 'M 91 392 Q 113 412 150 413 L 150 433 Q 108 433 83 417 Z'],
  ['M 150 364 Q 172 363 188 354 L 201 367 Q 179 388 150 389 Z', 'M 150 389 Q 179 388 201 367 L 209 392 Q 187 412 150 413 Z', 'M 150 413 Q 187 412 209 392 L 217 417 Q 192 433 150 433 Z'],
  ['M 188 354 Q 196 358 201 367 L 224 355 Q 218 347 209 342 L 192 339 Z', 'M 201 367 Q 214 362 224 355 L 242 372 Q 227 385 209 392 Z', 'M 209 392 Q 227 385 242 372 L 267 387 Q 245 407 217 417 Z']
]

function RadarSensor({ value, paths }: { value: number; paths: string[] }) {
  const levels = [value >= 24, value >= 14, value > 0]
  const colours = ['#ff4d55', '#ffb547', '#63e2a7']
  return <>{paths.map((path, index) => <path key={path} d={path} fill={levels[index] ? colours[index] : 'rgba(91,119,145,.11)'} stroke={levels[index] ? colours[index] : 'rgba(175,205,230,.2)'} strokeWidth="1.25" strokeLinejoin="round" opacity={levels[index] ? .82 : .82} filter={levels[index] ? `url(#glow-${index})` : undefined} />)}</>
}

function ParkingRadar({ front, rear }: { front: number[]; rear: number[] }) {
  return <Box sx={{ width: '100%', height: '100%', minHeight: 245, display: 'grid', placeItems: 'center' }}>
    <svg viewBox="0 0 300 440" width="100%" height="100%" aria-label="Parking sensor radar">
      <defs>
        <filter id="glow-0" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="glow-1" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="glow-2" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="car-shadow" x="-50%" y="-30%" width="200%" height="160%"><feDropShadow dx="0" dy="7" stdDeviation="8" floodColor="#000" floodOpacity=".72" /></filter>
      </defs>
      <text x="150" y="16" textAnchor="middle" fill="rgba(189,221,255,.45)" fontSize="9" letterSpacing="2">FRONT</text>
      {front.map((value, index) => <RadarSensor key={`front-${index}`} value={value} paths={frontPaths[index]} />)}
      {rear.map((value, index) => <RadarSensor key={`rear-${index}`} value={value} paths={rearPaths[index]} />)}
      <image href="/svgs/jaguar-xf-top.svg" x="55" y="80" width="190" height="280" preserveAspectRatio="xMidYMid meet" filter="url(#car-shadow)" />
      <text x="150" y="435" textAnchor="middle" fill="rgba(189,221,255,.45)" fontSize="9" letterSpacing="2">REAR</text>
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
