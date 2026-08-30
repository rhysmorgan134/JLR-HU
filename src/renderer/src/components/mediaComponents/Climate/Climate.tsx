import { Box, Button, IconButton, Typography } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import AirRoundedIcon from '@mui/icons-material/AirRounded'
import AcUnitRoundedIcon from '@mui/icons-material/AcUnitRounded'
import AirlineSeatReclineNormalRoundedIcon from '@mui/icons-material/AirlineSeatReclineNormalRounded'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded'
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded'
import WindPowerRoundedIcon from '@mui/icons-material/WindPowerRounded'
import { useNavigate } from 'react-router-dom'
import { useClimateStore } from '../../../store/store'

type SeatTemp = -3 | -2 | -1 | 0 | 1 | 2 | 3

function SeatControl({ value, onChange }: { value: SeatTemp; onChange: (value: SeatTemp) => void }) {
  const colour = value > 0 ? '#ff816f' : value < 0 ? '#67d8ff' : '#8e9aaa'
  return <Box sx={{ display: 'flex', alignItems: 'center', gap: .5 }}><IconButton disabled={value <= -3} onClick={() => onChange((value - 1) as SeatTemp)} sx={{ color: 'text.secondary' }}><KeyboardArrowLeftRoundedIcon /></IconButton><Box sx={{ width: 46, display: 'grid', justifyItems: 'center', color: colour }}><AirlineSeatReclineNormalRoundedIcon /><Box sx={{ mt: .5, display: 'flex', gap: .35 }}>{[1,2,3].map(level => <Box key={level} sx={{ width: 5, height: 5, borderRadius: '50%', background: Math.abs(value) >= level ? colour : 'rgba(255,255,255,.12)' }} />)}</Box></Box><IconButton disabled={value >= 3} onClick={() => onChange((value + 1) as SeatTemp)} sx={{ color: 'text.secondary' }}><KeyboardArrowRightRoundedIcon /></IconButton></Box>
}

function Zone({ label, temperature, seat, setSeat }: { label: string; temperature: number | null; seat: SeatTemp; setSeat: (value: SeatTemp) => void }) {
  return <Box className="glass-panel" sx={{ borderRadius: 3, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}><Typography sx={{ fontSize: 11, color: 'text.secondary', letterSpacing: 1.5 }}>{label}</Typography><Typography sx={{ fontSize: 58, fontWeight: 200, letterSpacing: -2 }}>{temperature == null ? '—' : temperature.toFixed(1)}<Typography component="span" sx={{ fontSize: 18, color: 'text.secondary' }}>°C</Typography></Typography><SeatControl value={seat} onChange={setSeat} /></Box>
}

export default function Climate() {
  const navigate = useNavigate()
  const state = useClimateStore()
  const modeButton = (active: boolean) => ({ minWidth: 0, height: 46, borderRadius: 2, border: active ? '1px solid rgba(103,216,255,.55)' : '1px solid var(--stroke)', color: active ? 'primary.main' : 'text.secondary', background: active ? 'var(--accent-soft)' : 'rgba(255,255,255,.03)' })
  return <Box sx={{ height: '100%', p: 1.5, display: 'grid', gridTemplateRows: '46px minmax(0,1fr)', gap: 1.25, overflow: 'hidden' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}><IconButton onClick={() => navigate('/home')} sx={{ width: 42, height: 42, color: 'white', background: 'rgba(255,255,255,.06)' }}><ArrowBackRoundedIcon /></IconButton><Box><Typography sx={{ fontSize: 11, color: 'primary.main', fontWeight: 700, letterSpacing: 1.7 }}>COMFORT</Typography><Typography sx={{ fontSize: 22, fontWeight: 500, lineHeight: 1 }}>Climate</Typography></Box><Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}><Typography sx={{ fontSize: 11, color: 'text.secondary', letterSpacing: 1.2 }}>FAN</Typography>{Array.from({ length: 7 },(_,i)=><Box key={i} sx={{ width: 8, height: 12+i*3, borderRadius: 1, background: i < state.fanSpeed ? 'primary.main' : 'rgba(255,255,255,.1)' }} />)}</Box></Box>
    <Box sx={{ minHeight: 0, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 190px minmax(0,1fr)', gap: 1.25 }}>
      <Zone label="DRIVER" temperature={state.leftTemp} seat={state.leftSeat} setSeat={state.setLeftSeat} />
      <Box className="glass-panel" sx={{ borderRadius: 3, p: 1.5, display: 'grid', gridTemplateRows: 'repeat(6,1fr)', gap: .75 }}>
        <Button onClick={state.setAuto} sx={modeButton(state.auto)}>AUTO</Button>
        <Button onClick={() => state.setAC(!state.ac)} startIcon={<AcUnitRoundedIcon />} sx={modeButton(state.ac)}>A/C</Button>
        <Button onClick={() => state.setWindscreen(!state.windscreen)} startIcon={<WindPowerRoundedIcon />} sx={modeButton(state.windscreen)}>SCREEN</Button>
        <Button onClick={() => state.setFace(!state.face)} startIcon={<AirRoundedIcon />} sx={modeButton(state.face)}>FACE</Button>
        <Button onClick={() => state.setFeet(!state.feet)} startIcon={<AirRoundedIcon sx={{ transform: 'rotate(45deg)' }} />} sx={modeButton(state.feet)}>FEET</Button>
        <Button onClick={state.setSync} sx={modeButton(false)}>SYNC</Button>
      </Box>
      <Zone label="PASSENGER" temperature={state.rightTemp} seat={state.rightSeat} setSeat={state.setRightSeat} />
    </Box>
  </Box>
}
