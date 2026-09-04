import Grid from '@mui/material/Unstable_Grid2'
import AudioSlider from './AudioSlider'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import { useAmplifierStore } from '../../../store/store'

export default function AudioSettings() {
  const [
    bass,
    setBass,
    balance,
    setBalance,
    treble,
    setTreble,
    subwoofer,
    setSubwoofer,
    centre,
    setCentre,
    mode,
    setMode,
    surround,
    setSurround,
    fader,
    setFader
  ] = useAmplifierStore((state) => [
    state.bass,
    state.setBass,
    state.balance,
    state.setBalance,
    state.treble,
    state.setTreble,
    state.subwoofer,
    state.setSubwoofer,
    state.centre,
    state.setCentre,
    state.mode,
    state.setMode,
    state.surround,
    state.setSurround,
    state.fader,
    state.setFader
  ])

  const handleChange = (e, alignment) => {
    console.log(alignment, e)
    setMode(alignment)
  }

  return (
    <Grid container sx={{ overflow: 'hidden' }} spacing={0.5}>
      <Grid xs={6}>
        <AudioSlider min={-6} max={6} setValue={setBass} value={bass} name={'bass'} />
      </Grid>
      <Grid xs={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ToggleButtonGroup value={mode} exclusive onChange={handleChange}>
          <ToggleButton value={0}>STEREO</ToggleButton>
          <ToggleButton value={1}>3 CHANNEL</ToggleButton>
          <ToggleButton value={2}>DOLBY PLII</ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid xs={6}>
        <AudioSlider min={-6} max={6} setValue={setTreble} value={treble} name={'treble'} />
      </Grid>
      <Grid xs={6}>
        <AudioSlider
          min={0}
          max={20}
          setValue={setSubwoofer}
          value={subwoofer}
          name={'subwoofer'}
        />
      </Grid>
      <Grid xs={6}>
        <AudioSlider min={-10} max={10} setValue={setFader} value={fader} name={'fader'} />
      </Grid>
      <Grid xs={6}>
        <AudioSlider min={-10} max={10} setValue={setBalance} value={balance} name={'balance'} />
      </Grid>
      {mode !== 0 ? (
        <Grid xs={6}>
          <AudioSlider min={-6} max={6} setValue={setCentre} value={centre} name={'centre'} />
        </Grid>
      ) : (
        <Grid xs={6}></Grid>
      )}
      {mode === 2 ? (
        <Grid xs={6}>
          <AudioSlider min={-6} max={6} setValue={setSurround} value={surround} name={'surround'} />
        </Grid>
      ) : (
        <Grid xs={6}></Grid>
      )}
    </Grid>
  )
}
