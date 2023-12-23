import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Paper from '@mui/material/Paper'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import './settings.css'

export function VehicleSettings() {
  return (
    <Box sx={{ height: '100%' }}>
      <Grid container spacing={2} sx={{ height: '100%', marginLeft: '10px', marginRight: '10px' }}>
        <Grid xs={6} sx={{ height: '100%' }}>
          <Paper elevation={0} sx={{ height: 'calc(100%)' }}>
            <Typography sx={{ fontWeight: 700 }}>Vehicle Setup</Typography>
            <Box className={'dataInput'}>
              <Typography sx={{ fontWeight: 700 }}>Manufacturer</Typography>
              <FormControl>
                <RadioGroup row>
                  <FormControlLabel
                    labelPlacement="start"
                    value={'LR'}
                    control={<Radio />}
                    label={'LR'}
                  />
                  <FormControlLabel
                    labelPlacement="start"
                    value={'Jaguar'}
                    control={<Radio />}
                    label={'Jaguar'}
                  />
                </RadioGroup>
              </FormControl>
            </Box>
            <Box className={'dataInput'}>
              <Typography sx={{ fontWeight: 700 }}>Parking Sensors</Typography>
              <FormControl>
                <RadioGroup row sx={{ alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                  <FormControlLabel
                    value={'none'}
                    labelPlacement="start"
                    control={<Radio />}
                    label={'None'}
                  />
                  <FormControlLabel
                    value={'rear'}
                    labelPlacement="start"
                    control={<Radio />}
                    label={'Rear'}
                  />
                  <FormControlLabel
                    value={'frontRear'}
                    control={<Radio />}
                    label={'Front & Rear'}
                    labelPlacement="start"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
            <Box className={'dataInput'}>
              <Typography sx={{ fontWeight: 700 }}>Amplifier Setup</Typography>
              <FormControl>
                <RadioGroup row sx={{ alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                  <FormControlLabel
                    labelPlacement="start"
                    value={'LR'}
                    control={<Radio />}
                    label={'Basic'}
                  />
                  <FormControlLabel
                    labelPlacement="start"
                    value={'Jaguar'}
                    control={<Radio />}
                    label={'Medium'}
                  />
                  <FormControlLabel
                    labelPlacement="start"
                    value={'Jaguar'}
                    control={<Radio />}
                    label={'Hi-Line'}
                  />
                </RadioGroup>
              </FormControl>
            </Box>
            <Box className={'dataInput'}>
              <Typography sx={{ fontWeight: 700 }}>Manufacturer</Typography>
              <FormControl>
                <RadioGroup row>
                  <FormControlLabel value={'LR'} control={<Radio />} label={'LR'} />
                  <FormControlLabel value={'Jaguar'} control={<Radio />} label={'Jaguar'} />
                </RadioGroup>
              </FormControl>
            </Box>
          </Paper>
        </Grid>
        <Grid xs={6} sx={{ height: '100%' }}>
          <Paper elevation={0} sx={{ height: 'calc(100%)' }}>
            <Typography sx={{ fontWeight: 700 }}>Vehicle Settings</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
