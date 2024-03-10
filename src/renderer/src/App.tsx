import { useEffect, useState, useMemo, createContext } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { HashRouter as Router, Route, Routes, Link as RouterLink } from 'react-router-dom'
import { Settings } from './components/settings/Settings'
import Info from './components/Info'
import Home from './components/Home'
import RestoreIcon from '@mui/icons-material/Restore'
import AlbumIcon from '@mui/icons-material/Album'
import RadioIcon from '@mui/icons-material/Radio'
import PhoneBluetoothSpeakerIcon from '@mui/icons-material/PhoneBluetoothSpeaker'
import Carplay from './components/Carplay'
import { Image } from 'mui-image'
import Camera from './components/mediaComponents/Camera/Camera'
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  createTheme,
  Modal,
  Slider,
  Stack,
  SvgIcon,
  ThemeProvider
} from '@mui/material'
import { useCanGatewayStore, useCarplayStore, useVolumeStore } from './store/store'
import AudioDiskPlayerPage from './components/mediaComponents/AudioDiskPlayer/AudioDiskPlayerPage'
import { VolumeDown, VolumeUp } from '@mui/icons-material'
import AmFmTuner from './components/mediaComponents/AmFm/AmFmTuner'
import AudioSettings from './components/mediaComponents/Amplifier/AudioSettings'
import { cyan } from '@mui/material/colors'
import Climate from './components/mediaComponents/Climate/Climate'
import ParkingSensors from './components/mediaComponents/Parking/ParkingSensors'
import Header from './components/dataDisplays/Header'

const ColorModeContext = createContext({ toggleColorMode: () => {} })

// rm -rf node_modules/.vite; npm run dev

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height: '95%',
  minHeight: '95%',
  width: '95%',
  boxShadow: 24,
  display: 'flex'
}

const settingsStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

const volumeStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#000000',
  border: 'none',
  boxShadow: 24,
  p: 4
}

function App() {
  const [receivingVideo, setReceivingVideo] = useState(false)
  const [commandCounter, setCommandCounter] = useState(0)
  // const [parkingActive, setParkingActive] = useState(false)
  const [manualClose, setManualClose] = useState(false)
  const [keyCommand, setKeyCommand] = useState('')
  const [reverse, setReverse] = useCarplayStore((state) => [state.reverse, state.setReverse])
  const [prevVolume, setPrevVolume] = useState(0)
  const [loc, setLoc] = useState('audio')
  const [settings, showSettings, setShowSettings, focus] = useCarplayStore((state) => [
    state.settings,
    state.showSettings,
    state.setShowSettings,
    state.focus
  ])
  const [externalTemp, parkingSensors, parkingActive, newSwitch, carplaySwitch] =
    useCanGatewayStore((state) => [
      state.externalTemp,
      state.parkingSensors,
      state.parkingActive,
      state.newSwitch,
      state.carplaySwitch
    ])
  const volume = useVolumeStore((state) => state.audioVolume)
  const [mode, setMode] = useState('dark')
  let volumeTimer
  let parkingTimer

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      }
    }),
    []
  )

  useEffect(() => {
    if (volumeTimer) {
      clearTimeout(volumeTimer)
    }
    volumeTimer = setTimeout(() => setPrevVolume(volume), 1000)
  }, [volume])

  // useEffect(() => {
  //   if (parkingTimer) {
  //     clearTimeout(parkingTimer)
  //   }
  //   if (!manualClose && !parkingActive) {
  //     setParkingActive(true)
  //   }
  //   parkingTimer = setTimeout(() => {
  //     setParkingActive(false)
  //     setManualClose(false)
  //   }, 1000)
  // }, [parkingSensors])

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'dark',
          primary: {
            main: '#303030'
          },
          background: {
            default: '#09101c',
            paper: '#303030'
          },
          text: {
            primary: '#FFFFFF'
          },
          secondary: cyan
        },
        components: {
          // MuiCssBaseline: {
          //     styleOverrides: (themeParam) => `
          //         body {
          //             overflow: hidden;
          //         }
          //     `
          // }
        }
      }),
    []
  )

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)

    return () => document.removeEventListener('keydown', onKeyDown)
  }, [settings])

  const onKeyDown = (event: KeyboardEvent) => {
    console.log(event.code)
    if (Object.values(settings!.bindings).includes(event.code)) {
      const action = Object.keys(settings!.bindings).find(
        (key) => settings!.bindings[key] === event.code
      )
      if (action !== undefined) {
        setKeyCommand(action)
        setCommandCounter((prev) => prev + 1)
        if (action === 'selectDown') {
          console.log('select down')
          setTimeout(() => {
            setKeyCommand('selectUp')
            setCommandCounter((prev) => prev + 1)
          }, 200)
        }
      }
    }
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div
            style={{ height: '100%', touchAction: 'none', overflow: 'hidden' }}
            // id={'main'}
            className="App"
          >
            {/*<Nav receivingVideo={receivingVideo} settings={settings}/>*/}
            <Header />
            <hr className={'style-two'} />
            {settings ? (
              <Carplay
                receivingVideo={receivingVideo}
                setReceivingVideo={setReceivingVideo}
                settings={settings}
                command={keyCommand}
                commandCounter={commandCounter}
              />
            ) : null}
            <Routes>
              <Route path={'/'} element={<Climate />} />
              <Route path={'/carplay'} element={<Home />} />
              <Route path={'/settings'} element={<Settings settings={settings!} />} />
              <Route path={'/info'} element={<Info />} />
              <Route path={'/climate'} element={<Climate />} />
              <Route path={'/camera'} element={<Camera settings={settings!} />} />
              <Route path={'/audioDiskPlayer'} element={<AudioDiskPlayerPage />} />
              <Route path={'/amFmTuner'} element={<AmFmTuner />} />
              <Route path={'/audioSettings'} element={<AudioSettings />} />
            </Routes>
            <Modal open={reverse} onClick={() => setReverse(false)}>
              <Box sx={style}>
                <Camera settings={settings} />
              </Box>
            </Modal>
            {/*<hr className={'style-two'} />*/}
            {focus ? (
              <div></div>
            ) : (
              <BottomNavigation className={'bottom-tab'}>
                <BottomNavigationAction
                  to={'/carplay'}
                  icon={
                    <SvgIcon fontSize={'large'}>
                      {/* credit: plus icon from https://heroicons.com/ */}
                      <svg
                        version="1.1"
                        id="carplay"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 367.65 384.06"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        fill={'currentColor'}
                      >
                        <path
                          d="M309.56,595c61.7-2.78,107.93-30.37,136.69-85.85,3.34-6.44,5.48-7.44,12.33-4.7s13.86,5.65,20.75,8.58c5.25,2.23,6.56,5.63,4.11,10.81q-28.87,60.87-89.13,91c-29,14.48-60,21.67-92.28,19.52-78.72-5.23-136.42-43.38-168.4-115.6C98.71,439.89,120,352.49,185.41,296.2c30.91-26.6,67.18-41.1,107.92-44.76,79.83-7.18,156.11,37.56,189.56,109,3.13,6.7,2.11,9.5-4.72,12.36-6.44,2.71-12.85,5.48-19.33,8.07-7.25,2.9-9.31,2.05-12.65-4.81a150.77,150.77,0,0,0-43-53.17c-82.93-65.1-206.6-27.28-238.72,73a152.41,152.41,0,0,0,97.71,191.55A146.18,146.18,0,0,0,309.56,595Z"
                          transform="translate(-116.98 -250.68)"
                        />
                        <path
                          d="M249.88,442.64q0-41.22,0-82.44c0-10.22,4.25-12.58,13.13-7.55q72.51,41.09,145.06,82.1c1,.57,2,1.13,3,1.76,5.92,3.76,6,8.82-.1,12.37-11.21,6.53-22.55,12.82-33.85,19.21Q320,500.42,262.93,532.75c-8.86,5-13,2.65-13.05-7.66Q249.85,483.87,249.88,442.64Z"
                          transform="translate(-116.98 -250.68)"
                        />
                      </svg>
                    </SvgIcon>
                  }
                  onClick={() => carplaySwitch()}
                  component={RouterLink}
                  sx={{ padding: 'none !important' }}
                  className={'bottom-button'}
                />
                <BottomNavigationAction
                  icon={
                    <RestoreIcon color={loc === 'home' ? 'secondary' : ''} fontSize={'large'} />
                  }
                  sx={{ padding: 'none !important' }}
                  component={RouterLink}
                  to={'/climate'}
                  onClick={() => setLoc('home')}
                  className={'bottom-button'}
                />
                <BottomNavigationAction
                  icon={
                    <AlbumIcon
                      color={loc === 'audioDiskPlayer' ? 'secondary' : ''}
                      fontSize={'large'}
                    />
                  }
                  sx={{ padding: 'none !important' }}
                  component={RouterLink}
                  onClick={() => {
                    newSwitch('audioDiskPlayer')
                    setLoc('audioDiskPlayer')
                  }}
                  to={'/audioDiskPlayer'}
                  className={'bottom-button'}
                />
                <BottomNavigationAction
                  icon={<RadioIcon fontSize={'large'} />}
                  sx={{ padding: 'none !important' }}
                  component={RouterLink}
                  onClick={() => newSwitch('amFmTuner')}
                  to={'/amFmTuner'}
                  className={'bottom-button'}
                />
                <BottomNavigationAction
                  icon={<PhoneBluetoothSpeakerIcon fontSize={'large'} />}
                  sx={{ padding: 'none !important' }}
                  className={'bottom-button'}
                />
                <BottomNavigationAction
                  icon={
                    <SvgIcon fontSize={'large'}>
                      {/* credit: plus icon from https://heroicons.com/ */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        width={20}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
                        />
                      </svg>
                    </SvgIcon>
                  }
                  component={RouterLink}
                  to={'/settings'}
                  className={'bottom-button'}
                />
              </BottomNavigation>
            )}
          </div>
        </Router>

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={showSettings}
          onClose={() => setShowSettings(false)}
          // closeAfterTransition
          // slots={{ backdrop: Backdrop }}
          // slotProps={{
          //     backdrop: {
          //         timeout: 500,
          //     },
          // }}
        >
          <Box sx={settingsStyle}>
            <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
              <Settings settings={settings!} />
            </Stack>
          </Box>
        </Modal>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={volume !== prevVolume}
          // closeAfterTransition
          // slots={{ backdrop: Backdrop }}
          // slotProps={{
          //     backdrop: {
          //         timeout: 500,
          //     },
          // }}
        >
          <Box sx={volumeStyle}>
            <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
              <VolumeDown />
              <Slider
                aria-label="Volume"
                value={volume}
                min={0}
                max={35}
                sx={{ transition: 'none' }}
              />
              <VolumeUp />
            </Stack>
          </Box>
        </Modal>
        <Modal open={parkingActive && !manualClose} onClick={() => setManualClose(true)}>
          <Box sx={style}>
            <Camera />
            <Box
              sx={{
                display: 'flex',
                alightItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                minHeight: '100%'
              }}
            >
              <ParkingSensors
                sensorFLL={parkingSensors.frontLeft}
                sensorFCL={parkingSensors.frontCentreLeft}
                sensorFCR={parkingSensors.frontCentreRight}
                sensorFRR={parkingSensors.frontRight}
                sensorBLL={parkingSensors.rearLeft}
                sensorBCL={parkingSensors.rearCentreLeft}
                sensorBCR={parkingSensors.rearCentreRight}
                sensorBRR={parkingSensors.rearRight}
              />
            </Box>
          </Box>
        </Modal>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App
