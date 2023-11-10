import { useEffect, useState, useMemo, createContext } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Settings from "./components/Settings";
import Info from "./components/Info";
import Home from "./components/Home";
import Nav from "./components/Nav";
import Carplay from './components/Carplay'
import Camera from './components/Camera'
import { Box, createTheme, CssBaseline, Modal, Slider, Stack, ThemeProvider } from '@mui/material'
import { useCarplayStore, useVolumeStore } from "./store/store";
import AudioDiskPlayerPage from './components/mediaComponents/AudioDiskPlayer/AudioDiskPlayerPage'
import { VolumeDown, VolumeUp } from "@mui/icons-material";

const ColorModeContext = createContext({ toggleColorMode: () => {} });

// rm -rf node_modules/.vite; npm run dev


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height: '95%',
  width: '95%',
  boxShadow: 24,
  display: "flex"
};

const volumeStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {
  const [receivingVideo, setReceivingVideo] = useState(false)
  const [commandCounter, setCommandCounter] = useState(0)
  const [keyCommand, setKeyCommand] = useState('')
  const [reverse, setReverse] = useState(false)
  const [prevVolume, setPrevVolume] = useState(0)
  const settings = useCarplayStore((state) => state.settings)
  const volume = useVolumeStore(state => state.audioVolume)
  const [mode, setMode] = useState('dark');
  let volumeTimer

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  useEffect(() => {
    if(volumeTimer) {
      clearTimeout(volumeTimer)
    }
    volumeTimer = setTimeout(() => setPrevVolume(volume), 1000)
  }, [volume])

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'dark',
          primary: {
            main: '#37474f'
          }
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
    [],
  );



  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)

    return () => document.removeEventListener('keydown', onKeyDown)
  }, [settings]);


  const onKeyDown = (event: KeyboardEvent) => {
    console.log(event.code)
    if(Object.values(settings!.bindings).includes(event.code)) {
      let action = Object.keys(settings!.bindings).find(key =>
        settings!.bindings[key] === event.code
      )
      if(action !== undefined) {
        setKeyCommand(action)
        setCommandCounter(prev => prev +1)
        if(action === 'selectDown') {
          console.log('select down')
          setTimeout(() => {
            setKeyCommand('selectUp')
            setCommandCounter(prev => prev +1)
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
          style={{ height: '100%', touchAction: 'none' }}
          id={'main'}
          className="App"

        >
          {/*<Nav receivingVideo={receivingVideo} settings={settings}/>*/}
          {settings ? <Carplay  receivingVideo={receivingVideo} setReceivingVideo={setReceivingVideo} settings={settings} command={keyCommand} commandCounter={commandCounter}/> : null}
          <Routes>
            <Route path={"/"} element={<Home />} />
            <Route path={"/settings"} element={<Settings settings={settings!}/>} />
            <Route path={"/info"} element={<Info />} />
            <Route path={"/camera"} element={<Camera settings={settings!}/>} />
            <Route path={"/audioDiskPlayer"} element={<AudioDiskPlayerPage />} />
          </Routes>
          <Modal
            open={reverse}
            onClick={()=> setReverse(false)}
          >
            <Box sx={style}>
              <Camera settings={settings}/>
            </Box>
          </Modal>
        </div>
      </Router>
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
            <Slider aria-label="Volume" value={volume} min={0} max={35} sx={{transition: 'none'}}/>
            <VolumeUp />
          </Stack>
        </Box>
      </Modal>
    </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App
