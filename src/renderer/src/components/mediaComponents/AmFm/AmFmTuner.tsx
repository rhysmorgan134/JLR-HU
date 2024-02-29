import Grid from '@mui/material/Unstable_Grid2'
import Box from '@mui/material/Box'
import Title from '../Common/Title'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import ReplyIcon from '@mui/icons-material/Reply'
import AmFmAudioControls from './AmFmAudioControls'
import Button from '@mui/material/Button'
import { CircularProgress, IconButton, Modal } from '@mui/material'
import useLongPress from '../../hooks/useLongPress'
import { useAmFmStore } from '../../../store/store'
import { useNavigate } from 'react-router-dom'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
  flexDirection: 'column'
}

function AmFmTuner() {
  const currentPreset = useAmFmStore((state) => state.chosenPreset)
  const frequency = useAmFmStore((state) => state.frequency)
  const presetList = useAmFmStore((state) => state.presetList)
  const currentStation = useAmFmStore((state) => state.currentStation)
  const autoStore = useAmFmStore((state) => state.autoStore)
  const [getPresets, startAutoStore, setPresetGroup, changeStation, saveStation] = useAmFmStore(
    (state) => [
      state.getPresets,
      state.startAutoStore,
      state.setPresetGroup,
      state.changeStation,
      state.saveStation
    ]
  )
  // const setAutoStore = useStatusStore(state => state.setAutoStore)
  const [chosenPreset, setChosenPreset] = useState(1)
  const [chosenStation, setChosenStation] = useState(1)
  const navigate = useNavigate()
  //console.log(presetList)
  const fmMap = {
    1: 'fm1',
    2: 'fm2',
    3: 'am'
  }
  const fmReverseMap = {
    fm1: 1,
    fm2: 2,
    am: 3
  }

  useEffect(() => {
    getPresets()
  }, [])

  useEffect(() => {
    if (frequency) {
      console.log(presetList?.[chosenPreset])
      if (presetList?.[chosenPreset]) {
        Object.keys(presetList[chosenPreset]).forEach((k) => {
          console.log(presetList[chosenPreset][k].frequency, frequency)
          if (presetList[chosenPreset][k].frequency === frequency) {
            console.log(presetList[currentPreset][k])
            setChosenStation(k)
          }
        })
      }
    }
  }, [frequency])

  const chooseStation = (_data, alignment) => {
    console.log('change station to: ', chosenPreset, alignment)
    changeStation(chosenPreset, alignment)
  }

  // const autoStoreStart = () => {
  //     setAutoStore(true)
  //     preSendMessage('autoStore')
  // }

  const onLongPress = (data) => {
    saveStation(chosenPreset, data.target.value)
    console.log('longpress', chosenPreset, data.target.value)
    // preSendMessage('savePreset', [chosenPreset, parseInt(data.target.value)])
  }

  const setPresetGroupPreSend = (data) => {
    console.log(chosenPreset, data.target.value)
    if (chosenPreset !== data.target.value) {
      setPresetGroup(chosenPreset, data.target.value)
      setChosenPreset(fmReverseMap[data.target.value])
    }
  }

  const onClick = () => {
    console.log('click is triggered')
  }

  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 500
  }

  const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions)

  return (
    <Grid
      container
      justifyContent="center"
      direction={'column'}
      id={'AudioDiskPlayer'}
      sx={{ height: 0.7, display: 'flex', flexGrow: 1 }}
    >
      <Button
        variant={'contained'}
        onClick={startAutoStore}
        sx={{ maxWidth: '150px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '1rem' }}
      >
        Auto Store
      </Button>
      {/*{renderDeck()}*/}
      <Grid xs={12} sx={{ height: 0.1 }}>
        <ToggleButtonGroup
          exclusive
          fullWidth={true}
          value={fmMap[1]}
          onChange={setPresetGroupPreSend}
        >
          <ToggleButton
            value="fm1"
            aria-label="left aligned"
            sx={{ width: '25%', minWidth: '25%' }}
          >
            FM1
          </ToggleButton>
          <ToggleButton value="fm2" aria-label="centered" sx={{ width: '25%', minWidth: '25%' }}>
            FM2
          </ToggleButton>
          <ToggleButton
            value="am"
            aria-label="right aligned"
            sx={{ width: '25%', minWidth: '25%' }}
          >
            AM
          </ToggleButton>
          <ToggleButton
            value="fma"
            aria-label="right aligned"
            sx={{ width: '25%', minWidth: '25%' }}
          >
            AutoStore
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid
        xs={12}
        sx={{
          alignItems: 'space-around',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          height: 0.5
        }}
      >
        <Grid
          container
          xs={12}
          sx={{ display: 'flex', flexGrow: 0, marginRight: '1rem', justifyContent: 'space-around' }}
        >
          <Grid xs={4}>
            <Title type={'radio'} title={'No Text'} />
          </Grid>
          <Grid xs={4}>
            <Title type={'song'} title={currentStation ? currentStation : 'No Text'} />
          </Grid>
          <Grid xs={4}>
            <Title type={'frequency'} title={`Frequency ${(frequency / 1000).toFixed(1)}`} />
          </Grid>
        </Grid>
        <Grid container xs={12} sx={{ flexGrow: 5, display: 'flex', height: 0.5 }}>
          <ToggleButtonGroup
            // value={alignment}
            exclusive
            onChange={chooseStation}
            aria-label="text alignment"
            sx={{ flexWrap: 'wrap' }}
            size={'large'}
            fullWidth={true}
            value={1}
          >
            {presetList?.[chosenPreset]?.[chosenStation] ? (
              Object.keys(presetList[chosenPreset]).map((item) => {
                return (
                  <ToggleButton
                    value={item}
                    {...longPressEvent}
                    aria-label="left aligned"
                    sx={{ width: '33.3333%', minWidth: '33.3333%' }}
                  >
                    {presetList[chosenPreset][item].name !== ''
                      ? presetList[chosenPreset][item].name
                      : (presetList[chosenPreset][item].frequency / 1000).toFixed(1)}
                  </ToggleButton>
                )
              })
            ) : (
              <Typography>
                Loading Stations: {JSON.stringify(presetList![chosenPreset])} station:
                {chosenStation}
              </Typography>
            )}
          </ToggleButtonGroup>
        </Grid>
      </Grid>
      <Grid xs={12} sx={{ flexGrow: 0, height: 0.1 }}>
        <AmFmAudioControls sendMessage={() => console.log('send message')} />
      </Grid>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={autoStore}
        // closeAfterTransition
        // slots={{ backdrop: Backdrop }}
        // slotProps={{
        //     backdrop: {
        //         timeout: 500,
        //     },
        // }}
      >
        {/*<Slide direction={"up"} in={volume !== prevVolume}>*/}
        <Box sx={style}>
          <Typography>Auto Store In Progress</Typography>
          <CircularProgress />
          <Typography>{frequency}</Typography>
        </Box>
        {/*</Slide>*/}
      </Modal>
    </Grid>
  )
}

export default AmFmTuner
