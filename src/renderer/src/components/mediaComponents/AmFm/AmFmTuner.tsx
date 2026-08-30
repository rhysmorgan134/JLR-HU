import { Box, IconButton, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded'
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import RadioRoundedIcon from '@mui/icons-material/RadioRounded'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAmFmTunerStore } from '../../../store/store'

type Preset = { stationName: string; frequency: number }

function PresetButton({ number, station, selected, isAm, onSelect, onSave }: { number: number; station?: Preset; selected: boolean; isAm: boolean; onSelect: () => void; onSave: () => void }) {
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const held = useRef(false)
  const stop = () => { if (holdTimer.current) clearTimeout(holdTimer.current); holdTimer.current = null }
  return <Box className="touch-card" onPointerDown={() => { held.current = false; holdTimer.current = setTimeout(() => { held.current = true; onSave() }, 650) }} onPointerUp={stop} onPointerLeave={stop} onClick={() => { if (!held.current) onSelect(); held.current = false }} sx={{ minWidth: 0, px: 1.2, py: .9, borderRadius: 2, cursor: 'pointer', border: selected ? '1px solid rgba(103,216,255,.7)' : '1px solid var(--stroke)', background: selected ? 'linear-gradient(145deg,rgba(38,174,235,.3),rgba(22,58,80,.5))' : 'rgba(255,255,255,.035)', display: 'grid', gridTemplateColumns: '26px minmax(0,1fr)', alignItems: 'center', gap: .8 }}>
    <Typography sx={{ fontSize: 19, fontWeight: 300, color: selected ? 'primary.main' : 'text.secondary' }}>{number}</Typography>
    <Box sx={{ minWidth: 0 }}><Typography noWrap sx={{ fontSize: 12, fontWeight: 600 }}>{station?.stationName?.trim() || (station?.frequency ? (isAm ? `${station.frequency} kHz` : `${(station.frequency / 1000).toFixed(1)} MHz`) : 'Empty')}</Typography><Typography noWrap sx={{ fontSize: 10, color: 'text.secondary' }}>{station?.stationName?.trim() && station.frequency ? (isAm ? `${station.frequency} kHz` : `${(station.frequency / 1000).toFixed(1)} MHz`) : 'Hold to save'}</Typography></Box>
  </Box>
}

export default function AmFmTuner() {
  const navigate = useNavigate()
  const state = useAmFmTunerStore()
  const currentBank = state.selectedBank as 'fm1' | 'fm2' | 'am'
  const presets = currentBank === 'fm1' ? state.fm1 : currentBank === 'fm2' ? state.fm2 : state.am
  const isAm = currentBank === 'am'
  useEffect(() => { state.getPresets() }, [])
  const cleanRadioText = state.radioText?.includes('STN') ? '' : state.radioText?.trim()
  const cleanNowPlaying = state.nowPlaying?.includes('STN') ? '' : state.nowPlaying?.replace(/^Now Playing:\s*/i, '').trim()
  const frequencyText = state.frequency == null ? '---' : isAm ? String(state.frequency) : (state.frequency / 1000).toFixed(1)

  return <Box sx={{ height: '100%', p: 1.5, display: 'grid', gridTemplateRows: '46px minmax(0,1fr)', gap: 1.25, overflow: 'hidden' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}><IconButton onClick={() => navigate('/home')} sx={{ width: 42, height: 42, color: 'white', background: 'rgba(255,255,255,.06)' }}><ArrowBackRoundedIcon /></IconButton><Box sx={{ mr: 'auto' }}><Typography sx={{ fontSize: 11, color: 'primary.main', fontWeight: 700, letterSpacing: 1.7 }}>ENTERTAINMENT</Typography><Typography sx={{ fontSize: 22, fontWeight: 500, lineHeight: 1 }}>Radio</Typography></Box>
      <ToggleButtonGroup exclusive value={currentBank} onChange={(_,value) => { if (value) state.setTunerType(value) }} sx={{ height: 40, border: '1px solid var(--stroke)', borderRadius: 2, '& .MuiToggleButton-root': { minWidth: 65, px: 1.5, border: 0, color: 'text.secondary', fontSize: 12, fontWeight: 700 }, '& .Mui-selected': { color: '#fff!important', background: 'var(--accent-soft)!important' } }}><ToggleButton value="fm1">FM1</ToggleButton><ToggleButton value="fm2">FM2</ToggleButton><ToggleButton value="am">AM</ToggleButton></ToggleButtonGroup>
      <IconButton onClick={state.autostore} sx={{ width: 40, height: 40, border: '1px solid var(--stroke)', color: 'primary.main' }}><AutoAwesomeRoundedIcon sx={{ fontSize: 20 }} /></IconButton>
    </Box>

    <Box sx={{ minHeight: 0, display: 'grid', gridTemplateColumns: 'minmax(280px,.8fr) minmax(0,1.2fr)', gap: 1.25 }}>
      <Box className="glass-panel" sx={{ borderRadius: 3, p: 2.25, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', width: 210, height: 210, borderRadius: '50%', right: -70, top: -75, background: 'radial-gradient(circle,rgba(41,187,255,.2),transparent 68%)' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><RadioRoundedIcon sx={{ color: 'primary.main', fontSize: 18 }} /><Typography sx={{ fontSize: 11, color: 'text.secondary', letterSpacing: 1.6 }}>{currentBank.toUpperCase()} · LIVE</Typography></Box>
        <Box><Typography sx={{ fontSize: isAm ? 52 : 64, fontWeight: 200, lineHeight: .92, letterSpacing: -2 }}>{frequencyText}<Typography component="span" sx={{ ml: .8, fontSize: 16, color: 'text.secondary', letterSpacing: 0 }}>{isAm ? 'kHz' : 'MHz'}</Typography></Typography><Typography noWrap sx={{ mt: 1.2, fontSize: 22, fontWeight: 600 }}>{cleanRadioText || 'Radio station'}</Typography>{cleanNowPlaying && <Typography noWrap sx={{ mt: .4, fontSize: 13, color: 'text.secondary' }}>{cleanNowPlaying}</Typography>}</Box>
        <Box sx={{ display: 'flex', gap: 1.2 }}><IconButton onClick={state.seekBack} sx={{ flex: 1, height: 48, borderRadius: 2, color: 'white', background: 'rgba(255,255,255,.06)', border: '1px solid var(--stroke)' }}><SkipPreviousRoundedIcon sx={{ fontSize: 30 }} /></IconButton><IconButton onClick={state.seekForward} sx={{ flex: 1, height: 48, borderRadius: 2, color: '#051018', background: 'linear-gradient(135deg,#8be4ff,#40c4ff)' }}><SkipNextRoundedIcon sx={{ fontSize: 30 }} /></IconButton></Box>
      </Box>

      <Box className="glass-panel" sx={{ borderRadius: 3, p: 1.5, minHeight: 0, display: 'grid', gridTemplateRows: '24px minmax(0,1fr)', gap: 1 }}><Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5 }}>PRESETS</Typography><Typography sx={{ fontSize: 10, color: 'text.secondary' }}>HOLD TO SAVE</Typography></Box><Box sx={{ minHeight: 0, display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gridTemplateRows: 'repeat(5,minmax(0,1fr))', gap: .75 }}>{Array.from({ length: 10 },(_,i) => { const number=i+1; const station=presets?.[number] ?? presets?.[i]; return <PresetButton key={number} number={number} station={station} isAm={isAm} selected={!!station?.frequency && station.frequency===state.frequency} onSelect={() => state.selectPreset(currentBank,number)} onSave={() => state.savePreset(currentBank,number)} /> })}</Box></Box>
    </Box>
  </Box>
}
