import { Box, SvgIcon, Typography } from '@mui/material'
import { TopData } from './TopData'
import { useCanGatewayStore, useClimateStore } from '../../store/store'

export default function Header() {
  const [externalTemp] = useCanGatewayStore((state) => [state.externalTemp])
  const [leftTemp, rightTemp, leftSeat, rightSeat] = useClimateStore((state) => [
    state.leftTemp,
    state.rightTemp,
    state.leftSeat,
    state.rightSeat
  ])
  return (
    <Box
      sx={{
        height: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Box sx={{ display: 'flex', width: 0.3, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', width: 0.4, justifyContent: 'space-around' }}>
          <Typography>{leftTemp}°C</Typography>
          <SvgIcon className={'svgButtonUnSelected'}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              x="0px"
              y="0px"
              viewBox="0 0 33 41.25"
              transform={'scale (-1, 1)'}
            >
              <path d="M8.27,32.5c0,0,7.709,0,10.98,0s5.68-2.082,6.309-4.439c2.021-7.591,3.977-15.011,6.074-24.066  c0.963-4.154-5.141-5.14-6.775,0s-7.01,17.756-7.01,17.756s-6.521,0.838-11.916-0.232c-4.264-0.848-6.191,3.621-3.27,7.943  C4.188,31.72,5.465,32.5,8.27,32.5z" />
              <path d="M8.446,11.612l-0.793-1.529C7.557,9.899,7.403,9.6,7.307,9.416L6.514,7.888c-0.096-0.184-0.252-0.184-0.346,0L5.375,9.416  C5.28,9.6,5.125,9.899,5.03,10.083l-0.793,1.529c-0.096,0.184-0.004,0.332,0.201,0.332h1.203c-0.104,0.895-0.342,1.896-0.771,2.313  c-1.557,1.512-1.557,3.037-1.557,5.346v0.163h1.502v-0.163c-0.002-2.197-0.002-3.199,1.1-4.269c0.842-0.816,1.133-2.36,1.236-3.39  h1.092C8.45,11.944,8.54,11.796,8.446,11.612z" />
              <path d="M14.137,11.612l-0.793-1.529c-0.096-0.184-0.252-0.483-0.348-0.667l-0.791-1.528c-0.096-0.184-0.252-0.184-0.346,0  l-0.793,1.528c-0.096,0.184-0.252,0.483-0.346,0.667l-0.793,1.529c-0.096,0.184-0.006,0.332,0.201,0.332h1.201  c-0.104,0.895-0.342,1.896-0.77,2.313c-1.559,1.512-1.557,3.037-1.557,5.346v0.163h1.5v-0.163c0-2.197,0-3.199,1.102-4.269  c0.842-0.816,1.133-2.36,1.236-3.39h1.092C14.141,11.944,14.231,11.796,14.137,11.612z" />
              <path d="M19.827,11.612l-0.793-1.529c-0.096-0.184-0.25-0.483-0.346-0.667l-0.793-1.528c-0.094-0.184-0.25-0.184-0.346,0  l-0.793,1.528c-0.096,0.184-0.25,0.483-0.346,0.667l-0.793,1.529c-0.094,0.184-0.004,0.332,0.203,0.332h1.201  c-0.104,0.895-0.342,1.896-0.771,2.313c-1.557,1.512-1.557,3.037-1.555,5.346v0.163h1.5v-0.163c0-2.197,0-3.199,1.1-4.269  c0.842-0.816,1.135-2.36,1.236-3.39h1.094C19.831,11.944,19.922,11.796,19.827,11.612z" />
            </svg>
          </SvgIcon>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              minHeight: 0.3,
              flexDirection: 'column'
            }}
          >
            <Box
              sx={{
                height: '3px',
                width: '3px',
                backgroundColor: leftSeat > 0 ? 'red' : 'blue',
                visibility: leftSeat > 0 || leftSeat < 0 ? 'visible' : 'hidden'
              }}
            ></Box>
            <Box
              sx={{
                height: '3px',
                width: '3px',
                backgroundColor: leftSeat > 0 ? 'red' : 'blue',
                visibility: leftSeat > 1 || leftSeat < -1 ? 'visible' : 'hidden'
              }}
            ></Box>
            <Box
              sx={{
                height: '3px',
                width: '3px',
                backgroundColor: leftSeat > 0 ? 'red' : 'blue',
                visibility: leftSeat > 2 || leftSeat < -2 ? 'visible' : 'hidden'
              }}
            ></Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, width: 0.3 }}>
        <Typography>18:00 - ext 18°C</Typography>
      </Box>

      <Box sx={{ display: 'flex', width: 0.3, flexGrow: 1, justifyContent: 'flex-end' }}>
        <Box
          sx={{
            display: 'flex',
            width: 0.4,
            justifyContent: 'space-around',
            alignContent: 'flex-end'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              minHeight: 0.3,
              flexDirection: 'column'
            }}
          >
            <Box
              sx={{
                height: '3px',
                width: '3px',
                backgroundColor: rightSeat > 0 ? 'red' : 'blue',
                visibility: rightSeat > 0 || rightSeat < 0 ? 'visible' : 'hidden'
              }}
            ></Box>
            <Box
              sx={{
                height: '3px',
                width: '3px',
                backgroundColor: rightSeat > 0 ? 'red' : 'blue',
                visibility: rightSeat > 1 || rightSeat < -1 ? 'visible' : 'hidden'
              }}
            ></Box>
            <Box
              sx={{
                height: '3px',
                width: '3px',
                backgroundColor: rightSeat > 0 ? 'red' : 'blue',
                visibility: rightSeat > 2 || rightSeat < -2 ? 'visible' : 'hidden'
              }}
            ></Box>
          </Box>
          <SvgIcon className={'svgButtonUnSelected'}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              x="0px"
              y="0px"
              viewBox="0 0 33 41.25"
            >
              <path d="M8.27,32.5c0,0,7.709,0,10.98,0s5.68-2.082,6.309-4.439c2.021-7.591,3.977-15.011,6.074-24.066  c0.963-4.154-5.141-5.14-6.775,0s-7.01,17.756-7.01,17.756s-6.521,0.838-11.916-0.232c-4.264-0.848-6.191,3.621-3.27,7.943  C4.188,31.72,5.465,32.5,8.27,32.5z" />
              <path d="M8.446,11.612l-0.793-1.529C7.557,9.899,7.403,9.6,7.307,9.416L6.514,7.888c-0.096-0.184-0.252-0.184-0.346,0L5.375,9.416  C5.28,9.6,5.125,9.899,5.03,10.083l-0.793,1.529c-0.096,0.184-0.004,0.332,0.201,0.332h1.203c-0.104,0.895-0.342,1.896-0.771,2.313  c-1.557,1.512-1.557,3.037-1.557,5.346v0.163h1.502v-0.163c-0.002-2.197-0.002-3.199,1.1-4.269c0.842-0.816,1.133-2.36,1.236-3.39  h1.092C8.45,11.944,8.54,11.796,8.446,11.612z" />
              <path d="M14.137,11.612l-0.793-1.529c-0.096-0.184-0.252-0.483-0.348-0.667l-0.791-1.528c-0.096-0.184-0.252-0.184-0.346,0  l-0.793,1.528c-0.096,0.184-0.252,0.483-0.346,0.667l-0.793,1.529c-0.096,0.184-0.006,0.332,0.201,0.332h1.201  c-0.104,0.895-0.342,1.896-0.77,2.313c-1.559,1.512-1.557,3.037-1.557,5.346v0.163h1.5v-0.163c0-2.197,0-3.199,1.102-4.269  c0.842-0.816,1.133-2.36,1.236-3.39h1.092C14.141,11.944,14.231,11.796,14.137,11.612z" />
              <path d="M19.827,11.612l-0.793-1.529c-0.096-0.184-0.25-0.483-0.346-0.667l-0.793-1.528c-0.094-0.184-0.25-0.184-0.346,0  l-0.793,1.528c-0.096,0.184-0.25,0.483-0.346,0.667l-0.793,1.529c-0.094,0.184-0.004,0.332,0.203,0.332h1.201  c-0.104,0.895-0.342,1.896-0.771,2.313c-1.557,1.512-1.557,3.037-1.555,5.346v0.163h1.5v-0.163c0-2.197,0-3.199,1.1-4.269  c0.842-0.816,1.135-2.36,1.236-3.39h1.094C19.831,11.944,19.922,11.796,19.827,11.612z" />
            </svg>
          </SvgIcon>
          <Typography>{leftTemp}°C</Typography>
        </Box>
      </Box>
    </Box>
  )
}
