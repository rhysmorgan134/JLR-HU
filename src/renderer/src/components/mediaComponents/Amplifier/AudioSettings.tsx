import Grid from '@mui/material/Unstable_Grid2'
import AudioSlider from './AudioSlider'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import { useAmplifierStore } from '../../../store/store'
import { SurroundType } from '../../../../../main/PiMostFunctions/Amplifier/AmplifierTypes'

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
      {mode !== 'stereo' ? (
        <Grid xs={6}>
          <AudioSlider min={-6} max={6} setValue={setCentre} value={centre} name={'centre'} />
        </Grid>
      ) : (
        <Grid xs={6}></Grid>
      )}
      {mode === 'dolbyProLogic' ? (
        <Grid xs={6}>
          <AudioSlider min={-6} max={6} setValue={setMode} value={mode} name={'surround'} />
        </Grid>
      ) : (
        <Grid xs={6}></Grid>
      )}
    </Grid>
  )
}
