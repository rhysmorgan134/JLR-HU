import { Slider } from '@mui/material'
import Box from '@mui/material/Box'
import { AddCircle, RemoveCircle } from '@mui/icons-material'
import Grid from '@mui/material/Unstable_Grid2'
import Typography from '@mui/material/Typography'

type AudioSliderProps = {
  min: number
  max: number
  name: string
  setValue: (value: number) => void
  value: number
  disabled?: boolean
}

//const marks = [{value: -3, label: '-3'}];

export default function AudioSlider({ min, max, name, setValue, value, disabled = false }: AudioSliderProps) {
  // useEffect(() => {
  //     console.log("Sending", "set" + name.charAt(0).toUpperCase() + name.slice(1))
  //   sendMessage("get" + name.charAt(0).toUpperCase() + name.slice(1), 'Amplifier')
  // }, [])

  const getMax = () => {
    const marks: Array<{ value: number; label: string }> = []
    console.log(max - min)
    if (max - min > 12) {
      for (let i = min; i <= max; i += 2) {
        marks.push({ value: i, label: i.toString() })
      }
    } else {
      for (let i = min; i <= max; i++) {
        marks.push({ value: i, label: i.toString() })
      }
    }
    return marks
  }

  const onChange = (_event: Event, nextValue: number | number[]) => {
    if (typeof nextValue === 'number') setValue(nextValue)
  }

  const increment = () => {
    if (value + 1 <= max) {
      setValue(value + 1)
    }
  }

  const decrement = () => {
    if (value - 1 >= min) {
      setValue(value - 1)
    }
  }

  function valuetext(value: number) {
    return `${value}°C`
  }

  return (
    <Grid xs={12}>
      <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
        <Typography>{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
      </Box>
      <Box display={'flex'}>
        <RemoveCircle
          fontSize={'large'}
          sx={{ visibility: value <= min ? 'hidden' : '', marginLeft: '1rem', marginRight: '1rem' }}
          onClick={decrement}
        />
        <Slider
          aria-label="Custom marks"
          step={1}
          min={min}
          max={max}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          onChange={onChange}
          value={value}
          marks={getMax()}
          disabled={disabled}
          sx={{ marginLeft: '1rem', marginRight: '1rem' }}
          color="secondary"
        />
        <AddCircle
          fontSize={'large'}
          sx={{ visibility: value >= max ? 'hidden' : '', marginLeft: '1rem', marginRight: '1rem' }}
          onClick={increment}
        />
      </Box>
    </Grid>
  )
}
