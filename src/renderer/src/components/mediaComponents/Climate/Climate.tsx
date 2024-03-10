import Grid from '@mui/material/Unstable_Grid2'
import './climate.css'

import { ButtonBase, IconButton, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { SvgIcon } from '@mui/material'
import { Image } from 'mui-image'
import Sync from '../../../../public/svgs/Sync'
import Windscreen from './windscreen.svg?react'
import Face from './face.svg?react'
import Feet from './feet.svg?react'
import { useClimateStore } from '../../../store/store'
import Button from '@mui/material/Button'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import { useRef } from 'react'

function Climate() {
  const [
    lefTemp,
    rightTemp,
    recirc,
    auto,
    maxDefrost,
    fanSpeed,
    face,
    feet,
    windscreen,
    ac,
    setWindscreen,
    setFace,
    setFeet,
    setSync,
    setAuto,
    setAC,
    leftSeat,
    rightSeat,
    setLeftSeat,
    seatRightSeat
  ] = useClimateStore((state) => [
    state.leftTemp,
    state.rightTemp,
    state.recirc,
    state.auto,
    state.maxDefrost,
    state.fanSpeed,
    state.face,
    state.feet,
    state.windscreen,
    state.ac,
    state.setWindscreen,
    state.setFace,
    state.setFeet,
    state.setSync,
    state.setAuto,
    state.setAC,
    state.leftSeat,
    state.rightSeat,
    state.setLeftSeat,
    state.setRightSeat
  ])
  const leftSeatRef = useRef()
  const rightSeatRef = useRef()

  //
  // const useStyles = makeStyles((theme) => ({
  //   root: {
  //     display: 'flex',
  //     alignItems: 'center',
  //     justifyContent: 'center'
  //   },
  //   label: {
  //     position: 'absolute',
  //     color: 'white'
  //   }
  // }))

  const buttons = [
    <div
      className={'container fan' + (fanSpeed == 7 ? ' fanSelected' : '')}
      style={{ borderRadius: '10px 10px 0px 0px' }}
      key="seven"
    >
      {fanSpeed === 7 ? (
        <SvgIcon style={{ fill: '#FFFFFF', fontSize: '24px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" x="0px" y="0px">
            <title>Fan, AC, Air, Blow, Wind</title>
            <g>
              <path d="M37.4218,23.61c-.0162-.01-.0331-.02-.0494-.03C37.3887,23.59,37.4056,23.599,37.4218,23.61ZM40,32a8,8,0,1,1-8-8A8.0092,8.0092,0,0,1,40,32Zm-2,0a6.0066,6.0066,0,0,0-6-6,1,1,0,0,0,0,2,4.0045,4.0045,0,0,1,4,4,1,1,0,0,0,2,0ZM24.2617,25.6757a9.95,9.95,0,0,1,12.156-2.6335h0l4.752-4.4547a1,1,0,0,0,.2271-1.1416A23.7612,23.7612,0,0,0,36.95,11.4941L33.7783,8.3228A13.5133,13.5133,0,0,0,14.666,8.3223l-.3437.3432a5.005,5.005,0,0,0,0,7.0708Zm-.6814.9506c.01-.0156.0188-.032.0289-.0476C23.5992,26.5944,23.59,26.6106,23.58,26.6263ZM22,32a9.9231,9.9231,0,0,1,1.0422-4.4177v0l-4.4547-4.752a1,1,0,0,0-1.1416-.2271A23.7612,23.7612,0,0,0,11.4941,27.05L8.3228,30.2217A13.5133,13.5133,0,0,0,8.3223,49.334l.3432.3437a5.0047,5.0047,0,0,0,7.0708,0l9.9394-9.9394A9.9827,9.9827,0,0,1,22,32ZM55.6777,14.666l-.3432-.3437a5.0058,5.0058,0,0,0-7.0708,0l-9.9394,9.9394a9.9781,9.9781,0,0,1,2.49,12.4542l4.6324,4.4877a1,1,0,0,0,1.1079.1929A23.7612,23.7612,0,0,0,52.5059,36.95l3.1713-3.1714a13.5133,13.5133,0,0,0,.0005-19.1123Zm-29.1392,25.7-.0155-.0094Zm13.2-2.042a9.96,9.96,0,0,1-12.2977,2.5651h0l-4.6261,4.5388a1,1,0,0,0-.211,1.126A23.7612,23.7612,0,0,0,27.05,52.5059l3.1714,3.1713a13.5133,13.5133,0,0,0,19.1123.0005l.3437-.3432a5.005,5.005,0,0,0,0-7.0708Z" />
            </g>
          </svg>
        </SvgIcon>
      ) : (
        7
      )}
    </div>,
    <div className={'container fan' + (fanSpeed == 6 ? ' fanSelected' : '')} key="six">
      {fanSpeed === 6 ? (
        <SvgIcon style={{ fill: '#FFFFFF', fontSize: '24px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" x="0px" y="0px">
            <title>Fan, AC, Air, Blow, Wind</title>
            <g>
              <path d="M37.4218,23.61c-.0162-.01-.0331-.02-.0494-.03C37.3887,23.59,37.4056,23.599,37.4218,23.61ZM40,32a8,8,0,1,1-8-8A8.0092,8.0092,0,0,1,40,32Zm-2,0a6.0066,6.0066,0,0,0-6-6,1,1,0,0,0,0,2,4.0045,4.0045,0,0,1,4,4,1,1,0,0,0,2,0ZM24.2617,25.6757a9.95,9.95,0,0,1,12.156-2.6335h0l4.752-4.4547a1,1,0,0,0,.2271-1.1416A23.7612,23.7612,0,0,0,36.95,11.4941L33.7783,8.3228A13.5133,13.5133,0,0,0,14.666,8.3223l-.3437.3432a5.005,5.005,0,0,0,0,7.0708Zm-.6814.9506c.01-.0156.0188-.032.0289-.0476C23.5992,26.5944,23.59,26.6106,23.58,26.6263ZM22,32a9.9231,9.9231,0,0,1,1.0422-4.4177v0l-4.4547-4.752a1,1,0,0,0-1.1416-.2271A23.7612,23.7612,0,0,0,11.4941,27.05L8.3228,30.2217A13.5133,13.5133,0,0,0,8.3223,49.334l.3432.3437a5.0047,5.0047,0,0,0,7.0708,0l9.9394-9.9394A9.9827,9.9827,0,0,1,22,32ZM55.6777,14.666l-.3432-.3437a5.0058,5.0058,0,0,0-7.0708,0l-9.9394,9.9394a9.9781,9.9781,0,0,1,2.49,12.4542l4.6324,4.4877a1,1,0,0,0,1.1079.1929A23.7612,23.7612,0,0,0,52.5059,36.95l3.1713-3.1714a13.5133,13.5133,0,0,0,.0005-19.1123Zm-29.1392,25.7-.0155-.0094Zm13.2-2.042a9.96,9.96,0,0,1-12.2977,2.5651h0l-4.6261,4.5388a1,1,0,0,0-.211,1.126A23.7612,23.7612,0,0,0,27.05,52.5059l3.1714,3.1713a13.5133,13.5133,0,0,0,19.1123.0005l.3437-.3432a5.005,5.005,0,0,0,0-7.0708Z" />
            </g>
          </svg>
        </SvgIcon>
      ) : (
        6
      )}
    </div>,
    <div className={'container fan' + (fanSpeed == 5 ? ' fanSelected' : '')} key="five">
      {fanSpeed === 5 ? (
        <SvgIcon style={{ fill: '#FFFFFF', fontSize: '24px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" x="0px" y="0px">
            <title>Fan, AC, Air, Blow, Wind</title>
            <g>
              <path d="M37.4218,23.61c-.0162-.01-.0331-.02-.0494-.03C37.3887,23.59,37.4056,23.599,37.4218,23.61ZM40,32a8,8,0,1,1-8-8A8.0092,8.0092,0,0,1,40,32Zm-2,0a6.0066,6.0066,0,0,0-6-6,1,1,0,0,0,0,2,4.0045,4.0045,0,0,1,4,4,1,1,0,0,0,2,0ZM24.2617,25.6757a9.95,9.95,0,0,1,12.156-2.6335h0l4.752-4.4547a1,1,0,0,0,.2271-1.1416A23.7612,23.7612,0,0,0,36.95,11.4941L33.7783,8.3228A13.5133,13.5133,0,0,0,14.666,8.3223l-.3437.3432a5.005,5.005,0,0,0,0,7.0708Zm-.6814.9506c.01-.0156.0188-.032.0289-.0476C23.5992,26.5944,23.59,26.6106,23.58,26.6263ZM22,32a9.9231,9.9231,0,0,1,1.0422-4.4177v0l-4.4547-4.752a1,1,0,0,0-1.1416-.2271A23.7612,23.7612,0,0,0,11.4941,27.05L8.3228,30.2217A13.5133,13.5133,0,0,0,8.3223,49.334l.3432.3437a5.0047,5.0047,0,0,0,7.0708,0l9.9394-9.9394A9.9827,9.9827,0,0,1,22,32ZM55.6777,14.666l-.3432-.3437a5.0058,5.0058,0,0,0-7.0708,0l-9.9394,9.9394a9.9781,9.9781,0,0,1,2.49,12.4542l4.6324,4.4877a1,1,0,0,0,1.1079.1929A23.7612,23.7612,0,0,0,52.5059,36.95l3.1713-3.1714a13.5133,13.5133,0,0,0,.0005-19.1123Zm-29.1392,25.7-.0155-.0094Zm13.2-2.042a9.96,9.96,0,0,1-12.2977,2.5651h0l-4.6261,4.5388a1,1,0,0,0-.211,1.126A23.7612,23.7612,0,0,0,27.05,52.5059l3.1714,3.1713a13.5133,13.5133,0,0,0,19.1123.0005l.3437-.3432a5.005,5.005,0,0,0,0-7.0708Z" />
            </g>
          </svg>
        </SvgIcon>
      ) : (
        5
      )}
    </div>,
    <div className={'container fan' + (fanSpeed == 4 ? ' fanSelected' : '')} key="four">
      {fanSpeed === 4 ? (
        <SvgIcon style={{ fill: '#FFFFFF', fontSize: '24px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" x="0px" y="0px">
            <title>Fan, AC, Air, Blow, Wind</title>
            <g>
              <path d="M37.4218,23.61c-.0162-.01-.0331-.02-.0494-.03C37.3887,23.59,37.4056,23.599,37.4218,23.61ZM40,32a8,8,0,1,1-8-8A8.0092,8.0092,0,0,1,40,32Zm-2,0a6.0066,6.0066,0,0,0-6-6,1,1,0,0,0,0,2,4.0045,4.0045,0,0,1,4,4,1,1,0,0,0,2,0ZM24.2617,25.6757a9.95,9.95,0,0,1,12.156-2.6335h0l4.752-4.4547a1,1,0,0,0,.2271-1.1416A23.7612,23.7612,0,0,0,36.95,11.4941L33.7783,8.3228A13.5133,13.5133,0,0,0,14.666,8.3223l-.3437.3432a5.005,5.005,0,0,0,0,7.0708Zm-.6814.9506c.01-.0156.0188-.032.0289-.0476C23.5992,26.5944,23.59,26.6106,23.58,26.6263ZM22,32a9.9231,9.9231,0,0,1,1.0422-4.4177v0l-4.4547-4.752a1,1,0,0,0-1.1416-.2271A23.7612,23.7612,0,0,0,11.4941,27.05L8.3228,30.2217A13.5133,13.5133,0,0,0,8.3223,49.334l.3432.3437a5.0047,5.0047,0,0,0,7.0708,0l9.9394-9.9394A9.9827,9.9827,0,0,1,22,32ZM55.6777,14.666l-.3432-.3437a5.0058,5.0058,0,0,0-7.0708,0l-9.9394,9.9394a9.9781,9.9781,0,0,1,2.49,12.4542l4.6324,4.4877a1,1,0,0,0,1.1079.1929A23.7612,23.7612,0,0,0,52.5059,36.95l3.1713-3.1714a13.5133,13.5133,0,0,0,.0005-19.1123Zm-29.1392,25.7-.0155-.0094Zm13.2-2.042a9.96,9.96,0,0,1-12.2977,2.5651h0l-4.6261,4.5388a1,1,0,0,0-.211,1.126A23.7612,23.7612,0,0,0,27.05,52.5059l3.1714,3.1713a13.5133,13.5133,0,0,0,19.1123.0005l.3437-.3432a5.005,5.005,0,0,0,0-7.0708Z" />
            </g>
          </svg>
        </SvgIcon>
      ) : (
        4
      )}
    </div>,
    <div className={'container fan' + (fanSpeed == 3 ? ' fanSelected' : '')} key="three">
      {fanSpeed === 3 ? (
        <SvgIcon style={{ fill: '#FFFFFF', fontSize: '24px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" x="0px" y="0px">
            <title>Fan, AC, Air, Blow, Wind</title>
            <g>
              <path d="M37.4218,23.61c-.0162-.01-.0331-.02-.0494-.03C37.3887,23.59,37.4056,23.599,37.4218,23.61ZM40,32a8,8,0,1,1-8-8A8.0092,8.0092,0,0,1,40,32Zm-2,0a6.0066,6.0066,0,0,0-6-6,1,1,0,0,0,0,2,4.0045,4.0045,0,0,1,4,4,1,1,0,0,0,2,0ZM24.2617,25.6757a9.95,9.95,0,0,1,12.156-2.6335h0l4.752-4.4547a1,1,0,0,0,.2271-1.1416A23.7612,23.7612,0,0,0,36.95,11.4941L33.7783,8.3228A13.5133,13.5133,0,0,0,14.666,8.3223l-.3437.3432a5.005,5.005,0,0,0,0,7.0708Zm-.6814.9506c.01-.0156.0188-.032.0289-.0476C23.5992,26.5944,23.59,26.6106,23.58,26.6263ZM22,32a9.9231,9.9231,0,0,1,1.0422-4.4177v0l-4.4547-4.752a1,1,0,0,0-1.1416-.2271A23.7612,23.7612,0,0,0,11.4941,27.05L8.3228,30.2217A13.5133,13.5133,0,0,0,8.3223,49.334l.3432.3437a5.0047,5.0047,0,0,0,7.0708,0l9.9394-9.9394A9.9827,9.9827,0,0,1,22,32ZM55.6777,14.666l-.3432-.3437a5.0058,5.0058,0,0,0-7.0708,0l-9.9394,9.9394a9.9781,9.9781,0,0,1,2.49,12.4542l4.6324,4.4877a1,1,0,0,0,1.1079.1929A23.7612,23.7612,0,0,0,52.5059,36.95l3.1713-3.1714a13.5133,13.5133,0,0,0,.0005-19.1123Zm-29.1392,25.7-.0155-.0094Zm13.2-2.042a9.96,9.96,0,0,1-12.2977,2.5651h0l-4.6261,4.5388a1,1,0,0,0-.211,1.126A23.7612,23.7612,0,0,0,27.05,52.5059l3.1714,3.1713a13.5133,13.5133,0,0,0,19.1123.0005l.3437-.3432a5.005,5.005,0,0,0,0-7.0708Z" />
            </g>
          </svg>
        </SvgIcon>
      ) : (
        3
      )}
    </div>,
    <div className={'container fan' + (fanSpeed == 2 ? ' fanSelected' : '')} key="two">
      {fanSpeed === 2 ? (
        <SvgIcon style={{ fill: '#FFFFFF', fontSize: '24px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" x="0px" y="0px">
            <title>Fan, AC, Air, Blow, Wind</title>
            <g>
              <path d="M37.4218,23.61c-.0162-.01-.0331-.02-.0494-.03C37.3887,23.59,37.4056,23.599,37.4218,23.61ZM40,32a8,8,0,1,1-8-8A8.0092,8.0092,0,0,1,40,32Zm-2,0a6.0066,6.0066,0,0,0-6-6,1,1,0,0,0,0,2,4.0045,4.0045,0,0,1,4,4,1,1,0,0,0,2,0ZM24.2617,25.6757a9.95,9.95,0,0,1,12.156-2.6335h0l4.752-4.4547a1,1,0,0,0,.2271-1.1416A23.7612,23.7612,0,0,0,36.95,11.4941L33.7783,8.3228A13.5133,13.5133,0,0,0,14.666,8.3223l-.3437.3432a5.005,5.005,0,0,0,0,7.0708Zm-.6814.9506c.01-.0156.0188-.032.0289-.0476C23.5992,26.5944,23.59,26.6106,23.58,26.6263ZM22,32a9.9231,9.9231,0,0,1,1.0422-4.4177v0l-4.4547-4.752a1,1,0,0,0-1.1416-.2271A23.7612,23.7612,0,0,0,11.4941,27.05L8.3228,30.2217A13.5133,13.5133,0,0,0,8.3223,49.334l.3432.3437a5.0047,5.0047,0,0,0,7.0708,0l9.9394-9.9394A9.9827,9.9827,0,0,1,22,32ZM55.6777,14.666l-.3432-.3437a5.0058,5.0058,0,0,0-7.0708,0l-9.9394,9.9394a9.9781,9.9781,0,0,1,2.49,12.4542l4.6324,4.4877a1,1,0,0,0,1.1079.1929A23.7612,23.7612,0,0,0,52.5059,36.95l3.1713-3.1714a13.5133,13.5133,0,0,0,.0005-19.1123Zm-29.1392,25.7-.0155-.0094Zm13.2-2.042a9.96,9.96,0,0,1-12.2977,2.5651h0l-4.6261,4.5388a1,1,0,0,0-.211,1.126A23.7612,23.7612,0,0,0,27.05,52.5059l3.1714,3.1713a13.5133,13.5133,0,0,0,19.1123.0005l.3437-.3432a5.005,5.005,0,0,0,0-7.0708Z" />
            </g>
          </svg>
        </SvgIcon>
      ) : (
        2
      )}
    </div>,
    <div className={'container fan' + (fanSpeed == 1 ? ' fanSelected' : '')} key="one">
      {fanSpeed === 1 ? (
        <SvgIcon style={{ fill: '#FFFFFF', fontSize: '24px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" x="0px" y="0px">
            <title>Fan, AC, Air, Blow, Wind</title>
            <g>
              <path d="M37.4218,23.61c-.0162-.01-.0331-.02-.0494-.03C37.3887,23.59,37.4056,23.599,37.4218,23.61ZM40,32a8,8,0,1,1-8-8A8.0092,8.0092,0,0,1,40,32Zm-2,0a6.0066,6.0066,0,0,0-6-6,1,1,0,0,0,0,2,4.0045,4.0045,0,0,1,4,4,1,1,0,0,0,2,0ZM24.2617,25.6757a9.95,9.95,0,0,1,12.156-2.6335h0l4.752-4.4547a1,1,0,0,0,.2271-1.1416A23.7612,23.7612,0,0,0,36.95,11.4941L33.7783,8.3228A13.5133,13.5133,0,0,0,14.666,8.3223l-.3437.3432a5.005,5.005,0,0,0,0,7.0708Zm-.6814.9506c.01-.0156.0188-.032.0289-.0476C23.5992,26.5944,23.59,26.6106,23.58,26.6263ZM22,32a9.9231,9.9231,0,0,1,1.0422-4.4177v0l-4.4547-4.752a1,1,0,0,0-1.1416-.2271A23.7612,23.7612,0,0,0,11.4941,27.05L8.3228,30.2217A13.5133,13.5133,0,0,0,8.3223,49.334l.3432.3437a5.0047,5.0047,0,0,0,7.0708,0l9.9394-9.9394A9.9827,9.9827,0,0,1,22,32ZM55.6777,14.666l-.3432-.3437a5.0058,5.0058,0,0,0-7.0708,0l-9.9394,9.9394a9.9781,9.9781,0,0,1,2.49,12.4542l4.6324,4.4877a1,1,0,0,0,1.1079.1929A23.7612,23.7612,0,0,0,52.5059,36.95l3.1713-3.1714a13.5133,13.5133,0,0,0,.0005-19.1123Zm-29.1392,25.7-.0155-.0094Zm13.2-2.042a9.96,9.96,0,0,1-12.2977,2.5651h0l-4.6261,4.5388a1,1,0,0,0-.211,1.126A23.7612,23.7612,0,0,0,27.05,52.5059l3.1714,3.1713a13.5133,13.5133,0,0,0,19.1123.0005l.3437-.3432a5.005,5.005,0,0,0,0-7.0708Z" />
            </g>
          </svg>
        </SvgIcon>
      ) : (
        1
      )}
    </div>,
    <div className={'container fan' + (auto ? ' fanSelected' : '')} key="AUTO">
      AUTO
    </div>,
    <div
      className={'container fan' + (fanSpeed == 6 ? ' fanSelected' : '')}
      style={{ borderRadius: '0px 0px 10px 10px' }}
      key="OFF"
    >
      OFF
    </div>
  ]

  const WindscreenButton = (props) => {
    return (
      <div style={{ height: '100%', width: '90%' }}>
        <SvgIcon
          component={Windscreen}
          className={windscreen ? 'svgButtonSelected' : 'svgButtonUnSelected'}
          sx={{ height: '100%', width: '100%' }}
          viewBox="0 0 150 58"
        />
        <Typography>{props.label}</Typography>
      </div>
    )
  }

  const FaceButton = (props) => {
    return (
      <div style={{ height: '100%', width: '90%' }}>
        <SvgIcon
          component={Face}
          style={{ width: '100%', height: '100%' }}
          className={face ? 'svgButtonSelected' : 'svgButtonUnSelected'}
          viewBox="0 0 150 58"
        />
        <Typography>{props.label}</Typography>
      </div>
    )
  }

  const FeetButton = (props) => {
    return (
      <div style={{ height: '100%', width: '90%' }}>
        <SvgIcon
          component={Feet}
          className={feet ? 'svgButtonSelected' : 'svgButtonUnSelected'}
          style={{ width: '100%', height: '100%' }}
          viewBox="0 0 148 58"
        />
        <Typography>{props.label}</Typography>
      </div>
    )
  }

  return (
    <Grid container justifyContent="center" direction={'row'} className={'mainView'} columns={15}>
      <Grid
        xs={2}
        sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column'
        }}
      >
        <Button
          sx={{ height: 0.15 }}
          className={auto ? 'svgButtonSelected' : 'svgButtonUnSelected'}
          onClick={() => setAuto()}
        >
          Auto
        </Button>
        <ButtonBase sx={{ height: 0.15 }} focusRipple onClick={() => setWindscreen(!windscreen)}>
          <WindscreenButton label={''} />
        </ButtonBase>
        <ButtonBase sx={{ height: 0.15 }} focusRipple onClick={() => setFace(!face)}>
          <FaceButton label={''} />
        </ButtonBase>
        <ButtonBase sx={{ height: 0.15 }} focusRipple onClick={() => setFeet(!feet)}>
          <FeetButton label={''} />
        </ButtonBase>
        <Button sx={{ height: 0.15 }} onClick={() => setSync()}>
          tempSync
        </Button>
      </Grid>
      <Grid container xs={11} sx={{ height: '100%', justifyContent: 'space-around' }} columns={12}>
        <Grid xs={5} sx={{ height: '100%' }}>
          <Grid xs={12} sx={{ height: 0.7 }}>
            <Box
              sx={{ height: 0.2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <ArrowDropUpIcon sx={{ fontSize: '64px', margin: 0 }} />
              <p className={'glowText'}>{lefTemp}°C</p>
              <ArrowDropDownIcon sx={{ fontSize: '64px' }} />
            </Box>
          </Grid>
          <Grid
            xs={12}
            sx={{
              height: 0.3,
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <ArrowLeftIcon
                sx={{
                  fontSize: '64px',
                  maxHeight: 0.5,
                  visibility: leftSeat > -3 ? 'visible' : 'hidden'
                }}
                onClick={() => {
                  console.log(leftSeat)
                  console.log(leftSeat - 1)
                  setLeftSeat(leftSeat - 1)
                }}
              />
              <Box>
                <SvgIcon
                  className={'svgButtonUnSelected'}
                  sx={{ fontSize: '64px', maxHeight: 0.5 }}
                >
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
                <Box sx={{ display: 'flex', justifyContent: 'space-around', minHeight: 0.3 }}>
                  <Box
                    sx={{
                      height: '5px',
                      width: '5px',
                      backgroundColor: leftSeat > 0 ? 'red' : 'blue',
                      visibility: leftSeat > 0 || leftSeat < 0 ? 'visible' : 'hidden'
                    }}
                  ></Box>
                  <Box
                    sx={{
                      height: '5px',
                      width: '5px',
                      backgroundColor: leftSeat > 0 ? 'red' : 'blue',
                      visibility: leftSeat > 1 || leftSeat < -1 ? 'visible' : 'hidden'
                    }}
                  ></Box>
                  <Box
                    sx={{
                      height: '5px',
                      width: '5px',
                      backgroundColor: leftSeat > 0 ? 'red' : 'blue',
                      visibility: leftSeat > 2 || leftSeat < -2 ? 'visible' : 'hidden'
                    }}
                  ></Box>
                </Box>
              </Box>
              <ArrowRightIcon
                sx={{
                  fontSize: '64px',
                  maxHeight: 0.5,
                  visibility: leftSeat < 3 ? 'visible' : 'hidden'
                }}
                onClick={() => setLeftSeat(leftSeat + 1)}
              />
            </Box>
          </Grid>
        </Grid>
        <Grid xs={1} sx={{ height: '100%', paddingTop: '20px', paddingBottom: '20px' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              borderRadius: '10px',
              border: 'solid 0px'
            }}
          >
            {buttons}
          </Box>
        </Grid>
        <Grid xs={5} sx={{ height: '100%' }}>
          <Grid xs={6} sx={{ height: 0.7 }}>
            <Box
              sx={{ height: 0.2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <ArrowDropUpIcon sx={{ fontSize: '64px', margin: 0 }} />
              <p className={'glowText'}>{rightTemp}°C</p>
              <ArrowDropDownIcon sx={{ fontSize: '64px' }} />
            </Box>
          </Grid>
          <Grid
            xs={6}
            sx={{
              height: 0.3,
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center'
            }}
          >
            <Box>
              <SvgIcon className={'svgButtonUnSelected'} sx={{ fontSize: '64px', maxHeight: 0.5 }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  x="0px"
                  y="0px"
                  viewBox="0 0 33 41.25"
                  enableBackground="new 0 0 33 33"
                  xmlSpace="preserve"
                >
                  <path d="M8.27,32.5c0,0,7.709,0,10.98,0s5.68-2.082,6.309-4.439c2.021-7.591,3.977-15.011,6.074-24.066  c0.963-4.154-5.141-5.14-6.775,0s-7.01,17.756-7.01,17.756s-6.521,0.838-11.916-0.232c-4.264-0.848-6.191,3.621-3.27,7.943  C4.188,31.72,5.465,32.5,8.27,32.5z" />
                  <path d="M8.446,11.612l-0.793-1.529C7.557,9.899,7.403,9.6,7.307,9.416L6.514,7.888c-0.096-0.184-0.252-0.184-0.346,0L5.375,9.416  C5.28,9.6,5.125,9.899,5.03,10.083l-0.793,1.529c-0.096,0.184-0.004,0.332,0.201,0.332h1.203c-0.104,0.895-0.342,1.896-0.771,2.313  c-1.557,1.512-1.557,3.037-1.557,5.346v0.163h1.502v-0.163c-0.002-2.197-0.002-3.199,1.1-4.269c0.842-0.816,1.133-2.36,1.236-3.39  h1.092C8.45,11.944,8.54,11.796,8.446,11.612z" />
                  <path d="M14.137,11.612l-0.793-1.529c-0.096-0.184-0.252-0.483-0.348-0.667l-0.791-1.528c-0.096-0.184-0.252-0.184-0.346,0  l-0.793,1.528c-0.096,0.184-0.252,0.483-0.346,0.667l-0.793,1.529c-0.096,0.184-0.006,0.332,0.201,0.332h1.201  c-0.104,0.895-0.342,1.896-0.77,2.313c-1.559,1.512-1.557,3.037-1.557,5.346v0.163h1.5v-0.163c0-2.197,0-3.199,1.102-4.269  c0.842-0.816,1.133-2.36,1.236-3.39h1.092C14.141,11.944,14.231,11.796,14.137,11.612z" />
                  <path d="M19.827,11.612l-0.793-1.529c-0.096-0.184-0.25-0.483-0.346-0.667l-0.793-1.528c-0.094-0.184-0.25-0.184-0.346,0  l-0.793,1.528c-0.096,0.184-0.25,0.483-0.346,0.667l-0.793,1.529c-0.094,0.184-0.004,0.332,0.203,0.332h1.201  c-0.104,0.895-0.342,1.896-0.771,2.313c-1.557,1.512-1.557,3.037-1.555,5.346v0.163h1.5v-0.163c0-2.197,0-3.199,1.1-4.269  c0.842-0.816,1.135-2.36,1.236-3.39h1.094C19.831,11.944,19.922,11.796,19.827,11.612z" />
                </svg>
              </SvgIcon>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', minHeight: 0.3 }}>
                <Box
                  sx={{
                    height: '5px',
                    width: '5px',
                    backgroundColor: rightSeat > 0 ? 'red' : 'blue',
                    visibility: rightSeat > 0 || rightSeat < 0 ? 'visible' : 'hidden'
                  }}
                ></Box>
                <Box
                  sx={{
                    height: '5px',
                    width: '5px',
                    backgroundColor: rightSeat > 0 ? 'red' : 'blue',
                    visibility: rightSeat > 1 || rightSeat < -1 ? 'visible' : 'hidden'
                  }}
                ></Box>
                <Box
                  sx={{
                    height: '5px',
                    width: '5px',
                    backgroundColor: rightSeat > 0 ? 'red' : 'blue',
                    visibility: rightSeat > 2 || rightSeat < -2 ? 'visible' : 'hidden'
                  }}
                ></Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        xs={2}
        sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column'
        }}
      >
        <Button sx={{ height: 0.15 }}>Settings</Button>
        <Button
          sx={{ height: 0.15 }}
          className={ac ? 'svgButtonSelected' : 'svgButtonUnSelected'}
          onClick={() => setAC(!ac)}
        >
          A/C
        </Button>
        <Box sx={{ height: 0.15 }}></Box>
        <Box sx={{ height: 0.15 }}></Box>
        <Button sx={{ height: 0.15 }}>off</Button>
      </Grid>
    </Grid>
  )
}

export default Climate
