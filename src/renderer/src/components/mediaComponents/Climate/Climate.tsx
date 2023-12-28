import Grid from '@mui/material/Unstable_Grid2'
import './climate.css'

import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { SvgIcon } from '@mui/material'
import { Image } from 'mui-image'
import Sync from '../../../../public/svgs/Sync'
import { useClimateStore } from '../../../store/store'

function Climate() {
  const [lefTemp, rightTemp, recirc, auto, maxDefrost, fanSpeed] = useClimateStore((state) => [
    state.leftTemp,
    state.rightTemp,
    state.recirc,
    state.auto,
    state.maxDefrost,
    state.fanSpeed
  ])

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

  return (
    <Grid container justifyContent="center" direction={'row'} className={'mainView'} columns={13}>
      <Grid xs={6} sx={{ height: '100%' }}>
        <Grid xs={12} sx={{ height: 0.7 }}>
          <Box sx={{ height: 0.2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
          <Box>
            <SvgIcon className={'svgButtonUnSelected'} sx={{ fontSize: '64px', maxHeight: 0.5 }}>
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
              <Box sx={{ height: '5px', width: '5px', backgroundColor: 'red' }}></Box>
              <Box sx={{ height: '5px', width: '5px', backgroundColor: 'red' }}></Box>
              <Box sx={{ height: '5px', width: '5px', backgroundColor: 'red' }}></Box>
            </Box>
          </Box>
          <Box>
            <SvgIcon className={'svgButtonUnSelected'} sx={{ fontSize: '64px', maxHeight: 0.5 }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" x="0px" y="0px">
                <title>Air Vent Direction, Face, Heat, Climate Control</title>
                <g data-name="AC Direction Foot and Heat">
                  <path d="M41.55,12.28l-4.44,7.77a1.8949,1.8949,0,0,1-1.65.97,1.372,1.372,0,0,1-.4-.05,5.3549,5.3549,0,0,0,.43-4.83L35.03,15h.75l-1.82-3.19L32.14,15h.73l.77,1.89a3.2989,3.2989,0,0,1-.34,3.1l-.3.37a.71.71,0,0,0-.1.14c-.6-.11-1.28-.23-1.94-.33a5.4978,5.4978,0,0,0,.01-4.03L30.51,15h.71L29.4,11.81,27.58,15h.77l.76,1.89a3.298,3.298,0,0,1-.33,3.1l-.01.02h-.01a15.1006,15.1006,0,0,0-2.4.32,5.43,5.43,0,0,0,.09-4.19L25.98,15h.68l-1.82-3.19L23.02,15h.8l.77,1.89a3.2989,3.2989,0,0,1-.34,3.1l-.3.37a4.0657,4.0657,0,0,0-.43.65,1.8936,1.8936,0,0,1-1.83-.96l-4.43-7.77a1.8545,1.8545,0,0,1-.18-1.49,1.8811,1.8811,0,0,1,.95-1.17l3.52-1.87a16.6906,16.6906,0,0,1,15.7,0l3.53,1.87a1.9484,1.9484,0,0,1,.77,2.66ZM55,6a6,6,0,1,0,6,6A6.0066,6.0066,0,0,0,55,6ZM50.52,19.5742a6.1033,6.1033,0,0,0-6.5156,4.1319L41.0771,32H29.3223a6.0156,6.0156,0,0,0-5.21,3.0225L16.1865,48.8936A5.997,5.997,0,0,0,21.3174,58a6.0162,6.0162,0,0,0,5.2139-3.0234L32.8037,44H45.3223a6.0108,6.0108,0,0,0,5.6582-4.0029l4.4023-12.4746A6.007,6.007,0,0,0,50.52,19.5742ZM20.4805,35.291A2.0872,2.0872,0,0,0,18.5488,34H16V27a3.0033,3.0033,0,0,0-3-3H11a3.0033,3.0033,0,0,0-3,3v7H5.4512A2.1,2.1,0,0,0,3.87,37.4756l5.6436,9.6a.9986.9986,0,0,0,.1533.1982A3.2675,3.2675,0,0,0,12,48.2451h.001a3.2662,3.2662,0,0,0,2.332-.9717.9986.9986,0,0,0,.1533-.1982l5.6446-9.6A2.0993,2.0993,0,0,0,20.4805,35.291ZM30.33,21.25a4.1365,4.1365,0,0,0,.63-1.08A15.5853,15.5853,0,0,0,29,20a1.8484,1.8484,0,0,0-.23.01h-.01l-.29.35a5.25,5.25,0,0,0-.15,6.01.975.975,0,0,0,.82.42.9877.9877,0,0,0,.57-.18,1.0077,1.0077,0,0,0,.24-1.4,3.2909,3.2909,0,0,1,.07-3.59Zm-4.53,0a4.0368,4.0368,0,0,0,.56-.92c-1.05.21-1.97.45-2.24.52a1.8436,1.8436,0,0,1-.6.16,5.305,5.305,0,0,0,.28,5.36.97.97,0,0,0,.81.42,1.0185,1.0185,0,0,0,.58-.18,1.0077,1.0077,0,0,0,.24-1.4,3.2717,3.2717,0,0,1,.07-3.59Zm9.05,0c.07-.09.14-.18.21-.28a1.4039,1.4039,0,0,1-.35-.1c-.25-.06-.95-.21-1.81-.37a5.2719,5.2719,0,0,0-.06,5.87,1.0008,1.0008,0,0,0,.82.42,1.0421,1.0421,0,0,0,.58-.18,1.0056,1.0056,0,0,0,.23-1.4,3.2911,3.2911,0,0,1,.08-3.59Zm8.6468,18.4183" />
                </g>
              </svg>
            </SvgIcon>
            <Typography variant={'caption'} display={'block'} sx={{ margin: 'none' }}>
              Windscreen
            </Typography>
          </Box>
          <Box>
            <SvgIcon className={'svgButtonSelected'} sx={{ fontSize: '64px', maxHeight: 0.5 }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" x="0px" y="0px">
                <title>Climate Control, AC, Air Vent Direction Face</title>
                <path d="M57,12a6,6,0,1,1-6-6A6.0066,6.0066,0,0,1,57,12Zm-9.1006,7.8672a5.999,5.999,0,0,0-7.6548,3.6611L37.2549,32H25.5a6.0109,6.0109,0,0,0-5.2095,3.0234l-8,14A6,6,0,1,0,22.71,54.9766L28.9819,44H41.5a6.0092,6.0092,0,0,0,5.6577-4.0029L51.56,27.5225A6.0081,6.0081,0,0,0,47.8994,19.8672ZM23,23.5488A2.0864,2.0864,0,0,0,24.2905,25.48a2.0978,2.0978,0,0,0,2.1851-.35l9.6006-5.6436a1.0044,1.0044,0,0,0,.1982-.1533,3.286,3.286,0,0,0-.0005-4.666.9869.9869,0,0,0-.1977-.1533L26.4756,8.8691A2.101,2.101,0,0,0,23,10.4512V13H10a3.0033,3.0033,0,0,0-3,3v2a3.0033,3.0033,0,0,0,3,3H23Z" />
              </svg>
            </SvgIcon>
            <Typography variant={'caption'} display={'block'}>
              Face
            </Typography>
          </Box>
          <Box>
            <SvgIcon className={'svgButtonUnSelected'} sx={{ fontSize: '64px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" x="0px" y="0px">
                <path d="M61,13a6,6,0,1,1-6-6A6.0066,6.0066,0,0,1,61,13ZM50.6992,20.5752a6.1089,6.1089,0,0,0-6.5171,4.1318L41.2549,33H29.5a6.0109,6.0109,0,0,0-5.2095,3.0234l-7.9258,13.87a5.9984,5.9984,0,0,0,5.13,9.1074A6.0184,6.0184,0,0,0,26.71,55.9766L32.9819,45H45.5a6.0087,6.0087,0,0,0,5.6577-4.0029L55.56,28.5234a6.0052,6.0052,0,0,0-4.8609-7.9482ZM20.4805,36.291A2.0871,2.0871,0,0,0,18.5493,35H16V28a3.0033,3.0033,0,0,0-3-3H11a3.0033,3.0033,0,0,0-3,3v7H5.4512A2.1007,2.1007,0,0,0,3.87,38.4756l5.6445,9.6006a.9876.9876,0,0,0,.1529.1982,3.286,3.286,0,0,0,4.6655,0,1.0082,1.0082,0,0,0,.1533-.1982L20.13,38.4756A2.0968,2.0968,0,0,0,20.4805,36.291Z" />
              </svg>
            </SvgIcon>
            <Typography variant={'caption'} display={'block'}>
              Feet
            </Typography>
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
      <Grid xs={6} sx={{ height: '100%' }}>
        <Grid xs={12} sx={{ height: 0.7 }}>
          <Box sx={{ height: 0.2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ArrowDropUpIcon sx={{ fontSize: '64px', margin: 0 }} />
            <p className={'glowText'}>{rightTemp}°C</p>
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
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <SvgIcon className={'svgButtonSelected'} sx={{ fontSize: '64px' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                x="0px"
                y="0px"
                viewBox="0 0 91 113.75"
                enable-background="new 0 0 91 91"
                xml:space="preserve"
              >
                <g>
                  <path d="M86.734,49.492c-4.305,0.01-17.991,1.527-20.508,1.943c-1.589,0.261-3.454,0.267-4.732,1.335   c-1.173,0.98-0.649,2.788,0.453,3.52c1.182,0.78,17.18,0.641,19.686,0.645c-0.216,0.404-4.764,8.202-7.226,11.423   c-4.994,6.53-12.322,11.926-20.213,14.39c-9.906,3.093-21.47,0.982-30.055-4.716c-4.252-2.82-7.595-6.813-10.364-11.047   c-2.37-3.625-4.53-8.918-8.038-11.526c-0.238-0.18-0.687-0.002-0.732,0.298c-0.548,3.663,1.414,7.707,2.843,10.992   c1.7,3.904,4.146,7.539,6.933,10.755c5.891,6.799,14.97,10.758,23.738,12.057c15.313,2.272,30.362-4.708,39.961-16.643   c2.182-2.715,4.058-5.652,5.88-8.618c-0.04,4.63-0.08,9.262-0.109,13.891c-0.026,4.004,6.195,4.008,6.222,0   c0.054-8.303,0.122-16.604,0.122-24.907C90.594,51.061,87.978,49.49,86.734,49.492z" />
                  <path d="M17.98,20.688c5.096-5.933,12.107-11.209,19.818-13.11c10.523-2.591,23.726,1.216,31.448,8.788   c3.523,3.45,6.227,7.538,8.734,11.751c2.084,3.496,4.084,8.505,7.364,11.009c0.244,0.187,0.678-0.004,0.731-0.296   c0.637-3.572-1.238-7.563-2.511-10.82c-1.516-3.889-3.713-7.637-6.163-11.013C72.166,9.786,64.534,5.113,56.037,2.605   C39.996-2.125,24.416,4.048,13.693,16.4c-2.328,2.684-4.36,5.616-6.345,8.567c0.256-3.586,0.517-7.172,0.765-10.759   c0.278-3.995-5.944-3.977-6.221,0c-0.492,7.064-1.519,21.896-1.484,22.229c0.013,0.612-0.002,3.301,2.793,3.301   c3.233,0.002,10.855-0.29,14.028-0.466c2.881-0.16,5.805-0.179,8.675-0.475c1.158-0.121,3.727-0.079,3.836-1.451   c0.175-2.197-3.893-3.01-4.988-3.118c-3.061-0.304-13.198-1.281-15.208-1.447c0.288-0.488,0.571-0.964,0.853-1.389   C12.798,27.753,15.135,24.001,17.98,20.688z" />
                </g>
              </svg>
            </SvgIcon>
            <Typography variant={'caption'} display={'block'} sx={{ margin: 'none' }}>
              Sync
            </Typography>
          </Box>
          <Box>
            <SvgIcon className={'svgButtonUnSelected'} sx={{ fontSize: '64px' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 27 38.75"
                version="1.1"
                x="0px"
                y="0px"
              >
                <path d="M11.3226,4.17468 L12.5187,7.04526 C8.1066,7.45417 4.48611,10.5929 3.36207,14.7564 C6.52877,13.6196 9.9421,13.0002 13.5,13.0002 C17.058,13.0002 20.4712,13.6196 23.6379,14.7564 C23.4041,13.8904 23.0624,13.0688 22.628,12.3069 L22.628,12.3069 L25.8392,12.015 C26.5853,13.691 27,15.5471 27,17.5 C27,24.9559 20.9558,31 13.5,31 C6.04416,31 0,24.9559 0,17.5 C0,10.7854 4.90208,5.21578 11.3226,4.17468 L11.3226,4.17468 Z M17.8514,16.349 C17.9484,16.7164 18,17.1023 18,17.5002 C18,19.4595 16.7478,21.1264 15,21.7442 L15,27.8937 C19.8913,27.194 23.6952,23.1233 23.9825,18.1105 C22.0439,17.293 19.9898,16.6954 17.8514,16.349 Z M9.1486,16.349 C7.01031,16.6954 4.95616,17.2931 3.01746,18.1106 C3.30486,23.1233 7.10869,27.194 12,27.8937 L12,27.8937 L12,21.7441 C10.2522,21.1263 9,19.4595 9,17.5002 C9,17.1023 9.0517,16.7164 9.1486,16.349 Z M13.5,16.0002 C12.6716,16.0002 12,16.6718 12,17.5002 C12,18.3286 12.6716,19.0002 13.5,19.0002 C14.3285,19.0002 15,18.3286 15,17.5002 C15,16.6718 14.3285,16.0002 13.5,16.0002 Z M16.8358,0 C16.6203333,0.634746667 16.2321457,1.1144158 15.9135416,1.47712296 L15.7978,1.60773 L15.7479,1.66378 C15.2189,2.25983 15,2.55585 15,3 C15,3.40377273 15.1809091,3.68512397 15.6112472,4.18076296 L15.7479,4.33622 L15.7978,4.39227 C16.2719,4.92485 17,5.74264 17,7 C17,8.178775 16.3600684,8.97116523 15.8894305,9.5044583 L15.7978,9.6077 L15.7479,9.6638 C15.2669909,10.2056182 15.0423628,10.4995025 15.0054958,10.8821922 L15,11 L13,11 C13,9.8211875 13.6399316,9.02878613 14.1105695,8.4955083 L14.2022,8.39227 L14.2521,8.33622 C14.7811,7.74017 15,7.44415 15,7 C15,6.59622727 14.8190909,6.31487603 14.3887528,5.81923704 L14.2521,5.66378 L14.2022,5.60773 C13.7281,5.07515 13,4.25736 13,3 C13,1.821225 13.6399316,1.02879082 14.1105695,0.49550874 L14.2022,0.39227 L14.2521,0.33622 C14.3252333,0.253786667 14.3924556,0.177091111 14.4540037,0.104948148 L14.5421,0 L16.8358,0 Z M20.8358,0 C20.6203333,0.634746667 20.2321457,1.1144158 19.9135416,1.47712296 L19.7978,1.60773 L19.7479,1.66378 C19.2189,2.25983 19,2.55585 19,3 C19,3.40377273 19.1809091,3.68512397 19.6112472,4.18076296 L19.7479,4.33622 L19.7978,4.39227 C20.2719,4.92485 21,5.74264 21,7 C21,8.178775 20.3600684,8.97116523 19.8894305,9.5044583 L19.7978,9.6077 L19.7479,9.6638 C19.2669909,10.2056182 19.0423628,10.4995025 19.0054958,10.8821922 L19,11 L17,11 C17,9.8211875 17.6399316,9.02878613 18.1105695,8.4955083 L18.2022,8.39227 L18.2521,8.33622 C18.7811,7.74017 19,7.44415 19,7 C19,6.59622727 18.8190909,6.31487603 18.3887528,5.81923704 L18.2521,5.66378 L18.2022,5.60773 C17.7281,5.07515 17,4.25736 17,3 C17,1.821225 17.6399316,1.02879082 18.1105695,0.49550874 L18.2022,0.39227 L18.2521,0.33622 C18.3252333,0.253786667 18.3924556,0.177091111 18.4540037,0.104948148 L18.5421,0 L20.8358,0 Z M24.8358,0 C24.6203333,0.634746667 24.2321457,1.1144158 23.9135416,1.47712296 L23.7978,1.60773 L23.7479,1.66378 C23.2189,2.25983 23,2.55585 23,3 C23,3.40377273 23.1809091,3.68512397 23.6112472,4.18076296 L23.7479,4.33622 L23.7978,4.39227 C24.2719,4.92485 25,5.74264 25,7 C25,8.178775 24.3600684,8.97116523 23.8894305,9.5044583 L23.7978,9.6077 L23.7479,9.6638 C23.2669909,10.2056182 23.0423628,10.4995025 23.0054958,10.8821922 L23,11 L21,11 C21,9.8211875 21.6399316,9.02878613 22.1105695,8.4955083 L22.2022,8.39227 L22.2521,8.33622 C22.7811,7.74017 23,7.44415 23,7 C23,6.59622727 22.8190909,6.31487603 22.3887528,5.81923704 L22.2521,5.66378 L22.2022,5.60773 C21.7281,5.07515 21,4.25736 21,3 C21,1.821225 21.6399316,1.02879082 22.1105695,0.49550874 L22.2022,0.39227 L22.2521,0.33622 C22.3252333,0.253786667 22.3924556,0.177091111 22.4540037,0.104948148 L22.5421,0 L24.8358,0 Z" />
              </svg>
            </SvgIcon>
            <Typography variant={'caption'} display={'block'}>
              Face
            </Typography>
          </Box>
          <Box>
            <SvgIcon className={'svgButtonUnSelected'} sx={{ fontSize: '64px' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 27 38.75"
                version="1.1"
                x="0px"
                y="0px"
              >
                <path d="M11.3226,4.17468 L12.5187,7.04526 C8.1066,7.45417 4.48611,10.5929 3.36207,14.7564 C6.52877,13.6196 9.9421,13.0002 13.5,13.0002 C17.058,13.0002 20.4712,13.6196 23.6379,14.7564 C23.4041,13.8904 23.0624,13.0688 22.628,12.3069 L22.628,12.3069 L25.8392,12.015 C26.5853,13.691 27,15.5471 27,17.5 C27,24.9559 20.9558,31 13.5,31 C6.04416,31 0,24.9559 0,17.5 C0,10.7854 4.90208,5.21578 11.3226,4.17468 L11.3226,4.17468 Z M17.8514,16.349 C17.9484,16.7164 18,17.1023 18,17.5002 C18,19.4595 16.7478,21.1264 15,21.7442 L15,27.8937 C19.8913,27.194 23.6952,23.1233 23.9825,18.1105 C22.0439,17.293 19.9898,16.6954 17.8514,16.349 Z M9.1486,16.349 C7.01031,16.6954 4.95616,17.2931 3.01746,18.1106 C3.30486,23.1233 7.10869,27.194 12,27.8937 L12,27.8937 L12,21.7441 C10.2522,21.1263 9,19.4595 9,17.5002 C9,17.1023 9.0517,16.7164 9.1486,16.349 Z M13.5,16.0002 C12.6716,16.0002 12,16.6718 12,17.5002 C12,18.3286 12.6716,19.0002 13.5,19.0002 C14.3285,19.0002 15,18.3286 15,17.5002 C15,16.6718 14.3285,16.0002 13.5,16.0002 Z M16.8358,0 C16.6203333,0.634746667 16.2321457,1.1144158 15.9135416,1.47712296 L15.7978,1.60773 L15.7479,1.66378 C15.2189,2.25983 15,2.55585 15,3 C15,3.40377273 15.1809091,3.68512397 15.6112472,4.18076296 L15.7479,4.33622 L15.7978,4.39227 C16.2719,4.92485 17,5.74264 17,7 C17,8.178775 16.3600684,8.97116523 15.8894305,9.5044583 L15.7978,9.6077 L15.7479,9.6638 C15.2669909,10.2056182 15.0423628,10.4995025 15.0054958,10.8821922 L15,11 L13,11 C13,9.8211875 13.6399316,9.02878613 14.1105695,8.4955083 L14.2022,8.39227 L14.2521,8.33622 C14.7811,7.74017 15,7.44415 15,7 C15,6.59622727 14.8190909,6.31487603 14.3887528,5.81923704 L14.2521,5.66378 L14.2022,5.60773 C13.7281,5.07515 13,4.25736 13,3 C13,1.821225 13.6399316,1.02879082 14.1105695,0.49550874 L14.2022,0.39227 L14.2521,0.33622 C14.3252333,0.253786667 14.3924556,0.177091111 14.4540037,0.104948148 L14.5421,0 L16.8358,0 Z M20.8358,0 C20.6203333,0.634746667 20.2321457,1.1144158 19.9135416,1.47712296 L19.7978,1.60773 L19.7479,1.66378 C19.2189,2.25983 19,2.55585 19,3 C19,3.40377273 19.1809091,3.68512397 19.6112472,4.18076296 L19.7479,4.33622 L19.7978,4.39227 C20.2719,4.92485 21,5.74264 21,7 C21,8.178775 20.3600684,8.97116523 19.8894305,9.5044583 L19.7978,9.6077 L19.7479,9.6638 C19.2669909,10.2056182 19.0423628,10.4995025 19.0054958,10.8821922 L19,11 L17,11 C17,9.8211875 17.6399316,9.02878613 18.1105695,8.4955083 L18.2022,8.39227 L18.2521,8.33622 C18.7811,7.74017 19,7.44415 19,7 C19,6.59622727 18.8190909,6.31487603 18.3887528,5.81923704 L18.2521,5.66378 L18.2022,5.60773 C17.7281,5.07515 17,4.25736 17,3 C17,1.821225 17.6399316,1.02879082 18.1105695,0.49550874 L18.2022,0.39227 L18.2521,0.33622 C18.3252333,0.253786667 18.3924556,0.177091111 18.4540037,0.104948148 L18.5421,0 L20.8358,0 Z M24.8358,0 C24.6203333,0.634746667 24.2321457,1.1144158 23.9135416,1.47712296 L23.7978,1.60773 L23.7479,1.66378 C23.2189,2.25983 23,2.55585 23,3 C23,3.40377273 23.1809091,3.68512397 23.6112472,4.18076296 L23.7479,4.33622 L23.7978,4.39227 C24.2719,4.92485 25,5.74264 25,7 C25,8.178775 24.3600684,8.97116523 23.8894305,9.5044583 L23.7978,9.6077 L23.7479,9.6638 C23.2669909,10.2056182 23.0423628,10.4995025 23.0054958,10.8821922 L23,11 L21,11 C21,9.8211875 21.6399316,9.02878613 22.1105695,8.4955083 L22.2022,8.39227 L22.2521,8.33622 C22.7811,7.74017 23,7.44415 23,7 C23,6.59622727 22.8190909,6.31487603 22.3887528,5.81923704 L22.2521,5.66378 L22.2022,5.60773 C21.7281,5.07515 21,4.25736 21,3 C21,1.821225 21.6399316,1.02879082 22.1105695,0.49550874 L22.2022,0.39227 L22.2521,0.33622 C22.3252333,0.253786667 22.3924556,0.177091111 22.4540037,0.104948148 L22.5421,0 L24.8358,0 Z" />
              </svg>
            </SvgIcon>
            <Typography variant={'caption'} display={'block'}>
              Feet
            </Typography>
          </Box>
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
              <Box sx={{ height: '5px', width: '5px', backgroundColor: 'red' }}></Box>
              <Box sx={{ height: '5px', width: '5px', backgroundColor: 'red' }}></Box>
              <Box sx={{ height: '5px', width: '5px', backgroundColor: 'red' }}></Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Climate