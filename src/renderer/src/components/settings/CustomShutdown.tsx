import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Unstable_Grid2'
import { TextField } from '@mui/material'

interface Props {
  customShutdown: any
  setCustomShutdown: any
}

interface Bytes {
  [key: number]: number | string
}

const CustomShutdown: React.FC<Props> = ({ customShutdown, setCustomShutdown }) => {
  const renderBytes = (): React.ReactElement[] => {
    let bytes = []
    return (
      <>
        {customShutdown.data.map((val, index) => (
          <Grid key={index} xs={1}>
            <TextField
              id={'byte' + index}
              type={'number'}
              label={'Byte ' + index}
              value={customShutdown.data[index]}
              onChange={(event): void => {
                setByteValue(index, event.target.value)
              }}
              helperText={'Enter in Dec'}
            ></TextField>
          </Grid>
        ))}
      </>
    )
  }

  const setByteValue = (index, value): void => {
    let newData = customShutdown.data
    newData[index] = parseInt(value)
    setCustomShutdown({ ...customShutdown, data: newData })
  }

  console.log(customShutdown)
  return (
    <Grid container>
      <Grid xs={4}>
        <TextField
          id={'fBlock'}
          label={'fBlock'}
          value={customShutdown.fblockId}
          onChange={(event): void => {
            setCustomShutdown({ ...customShutdown, fblockId: parseInt(event.target.value) })
          }}
        ></TextField>
      </Grid>
      <Grid xs={4}>
        <TextField
          id={'fktId'}
          label={'fktId'}
          value={customShutdown.fktId}
          onChange={(event): void => {
            setCustomShutdown({ ...customShutdown, fktId: parseInt(event.target.value) })
          }}
        ></TextField>
      </Grid>
      <Grid xs={4}>
        <TextField
          id={'opType'}
          label={'opType'}
          value={customShutdown.optype}
          onChange={(event): void => {
            setCustomShutdown({ ...customShutdown, optype: parseInt(event.target.value) })
          }}
        ></TextField>
      </Grid>
      {renderBytes()}
    </Grid>
  )
}

export default CustomShutdown
