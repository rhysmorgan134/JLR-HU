import { createContext, useMemo } from 'react'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { HashRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import AudioDiskPlayerPage from './components/mediaComponents/AudioDiskPlayer/AudioDiskPlayerPage'
import ScreenSaver from './components/mediaComponents/ScreenSaver'
import Header from './components/dataDisplays/Header'
import Base from './Base'
import AmFmTunerPage from './components/mediaComponents/AmFm/AmFmTunerPage'
import VolumeModal from './components/VolumeModal'
import Climate from './components/mediaComponents/Climate/Climate'
import './App.css'

export const ColorModeContext = createContext({ toggleColorMode: () => {} })

function AppRoutes() {
  const { pathname } = useLocation()
  const screensaver = pathname === '/'
  return <>
    <Header />
    <VolumeModal />
    <main className={`App${screensaver ? ' is-screensaver' : ''}`}>
      <Routes>
        <Route path="/" element={<ScreenSaver />} />
        <Route path="/home" element={<Base />} />
        <Route path="/AudioDiskPlayer" element={<AudioDiskPlayerPage />} />
        <Route path="/AmFmTuner" element={<AmFmTunerPage />} />
        <Route path="/climate" element={<Climate />} />
      </Routes>
    </main>
  </>
}

export default function App() {
  const theme = useMemo(() => createTheme({
    palette: { mode: 'dark', primary: { main: '#67d8ff' }, secondary: { main: '#8b9cff' }, background: { default: '#080d14', paper: '#151e2a' }, text: { primary: '#f4f8ff', secondary: '#8e9aaa' } },
    shape: { borderRadius: 16 },
    typography: { fontFamily: 'Roboto, system-ui, sans-serif' },
    components: {
      MuiButtonBase: { defaultProps: { disableRipple: true } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiDialog: { styleOverrides: { paper: { backgroundImage: 'linear-gradient(145deg,#1b2634,#101721)', border: '1px solid rgba(189,221,255,.14)' } } }
    }
  }), [])
  return <ColorModeContext.Provider value={{ toggleColorMode: () => {} }}><ThemeProvider theme={theme}><CssBaseline /><Router><AppRoutes /></Router></ThemeProvider></ColorModeContext.Provider>
}
