import { Box, Typography } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAudioControlStore, useCanGatewayStore, useClimateStore, useHMIStore } from '../../store/store'

export default function Header() {
  const screensaver = useHMIStore((state) => state.screensaver)
  const currentSource = useAudioControlStore((state) => state.currentSource)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [hours, minutes, externalTemp, temperatureUnit] = useCanGatewayStore((state) => [state.hours, state.minutes, state.externalTemp, state.temperatureUnit])
  const [leftTemp, rightTemp, leftSeat, rightSeat] = useClimateStore((state) => [state.leftTemp, state.rightTemp, state.leftSeat, state.rightSeat])
  useEffect(() => { if (screensaver) navigate('/'); else if (pathname === '/') navigate('/home') }, [screensaver])
  const sourceLabel = currentSource === 'AmFmTuner' ? 'Radio' : currentSource === 'DabTuner' ? 'DAB Radio' : currentSource === 'AudioDiskPlayer' ? 'CD Player' : currentSource === 'Carplay' ? 'Apple CarPlay' : 'Audio off'
  const outside = externalTemp == null ? '—' : temperatureUnit === 'fahrenheit' ? `${(externalTemp * 9 / 5 + 32).toFixed(0)}°F` : `${externalTemp.toFixed(0)}°C`
  const climateTemperature = (value: number | null) => value == null ? '—' : `${value.toFixed(value % 1 ? 1 : 0)}°`
  const seat = (value: number) => value === 0 ? 'OFF' : value > 0 ? `H${value}` : `C${Math.abs(value)}`
  if (pathname === '/') return null
  return <Box sx={{ height: 42, px: 2.25, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(189,221,255,.09)', background: 'rgba(5,9,14,.76)', backdropFilter: 'blur(16px)' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CircleIcon sx={{ fontSize: 8, color: currentSource ? '#65e2a8' : '#6b7480', filter: 'drop-shadow(0 0 6px currentColor)' }} /><Typography sx={{ fontSize: 13, fontWeight: 500, color: 'text.secondary', letterSpacing: .3 }}>{sourceLabel}</Typography></Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.6 }}><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>OUT <Box component="span" sx={{ color: 'text.primary', fontWeight: 650 }}>{outside}</Box></Typography><Typography sx={{ fontSize: 15, fontWeight: 650, letterSpacing: 1.1 }}>{hours == null || minutes == null ? '--:--' : `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`}</Typography></Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>L <Box component="span" sx={{ color: 'text.primary', fontWeight: 650 }}>{climateTemperature(leftTemp)}</Box> · {seat(leftSeat)}</Typography><Typography sx={{ fontSize: 11, color: 'text.secondary' }}>R <Box component="span" sx={{ color: 'text.primary', fontWeight: 650 }}>{climateTemperature(rightTemp)}</Box> · {seat(rightSeat)}</Typography></Box>
  </Box>
}
