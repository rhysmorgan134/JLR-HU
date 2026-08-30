import { useMemo, createContext } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material'
import AudioDiskPlayerPage from './components/mediaComponents/AudioDiskPlayer/AudioDiskPlayerPage'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import { cyan } from '@mui/material/colors'

import './App.css'
import ScreenSaver from './components/mediaComponents/ScreenSaver'
import Header from './components/dataDisplays/Header'
import Base from './Base'
import AmFmTunerPage from './components/mediaComponents/AmFm/AmFmTunerPage'
import VolumeModal from './components/VolumeModal'

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

function App() {
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

  return (
    <ColorModeContext.Provider value={'dark'}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Header />
          <VolumeModal />
          <div
            style={{ height: '100%', touchAction: 'none', overflow: 'hidden' }}
            // id={'main'}
            className="App"
          >
            <Routes>
              <Route path={''} element={<ScreenSaver />} />
              <Route path={'/home'} element={<Base />} />
              <Route path={'/AudioDiskPlayer'} element={<AudioDiskPlayerPage />} />
              <Route path={'/AmFmTuner'} element={<AmFmTunerPage />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App
