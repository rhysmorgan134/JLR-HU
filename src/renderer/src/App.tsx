import { createContext, useEffect, useMemo, useState } from 'react'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { HashRouter as Router, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import AudioDiskPlayerPage from './components/mediaComponents/AudioDiskPlayer/AudioDiskPlayerPage'
import ScreenSaver from './components/mediaComponents/ScreenSaver'
import Header from './components/dataDisplays/Header'
import Base from './Base'
import AmFmTunerPage from './components/mediaComponents/AmFm/AmFmTunerPage'
import VolumeModal from './components/VolumeModal'
import Climate from './components/mediaComponents/Climate/Climate'
import './App.css'
import Carplay from '@renderer/components/Carplay'
import { useCarplayStore, useHMICommandStore, useMostOperatingModeStore } from './store/store'
import SettingsHub from './components/settings/SettingsHub'
import MostDiagnostics from './components/settings/MostDiagnostics'
import PiMostUsbSettings from './components/settings/PiMostUsbSettings'
import MostLogViewer from './components/settings/MostLogViewer'
import ParkingAssistOverlay from './components/ParkingAssistOverlay'
import AudioSettings from './components/mediaComponents/Amplifier/AudioSettings'
import { VehicleSettings } from './components/settings/VehicleSettings'
import ApplicationSettings from './components/settings/ApplicationSettings'
import SoftwareUpdate from './components/settings/SoftwareUpdate'

export const ColorModeContext = createContext({ toggleColorMode: () => {} })

function AppRoutes() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const hmiCommand = useHMICommandStore()
  useEffect(() => {
    if (hmiCommand.path) navigate(hmiCommand.path)
  }, [hmiCommand.nonce])
  const headUnitMode = useMostOperatingModeStore((state) => state.headUnit)
  if (!headUnitMode) return <main className="App is-explorer"><Routes>
    <Route path="/settings/most" element={<MostDiagnostics />} />
    <Route path="/settings/most-logs" element={<MostLogViewer />} />
    <Route path="/settings/pimost-usb" element={<PiMostUsbSettings />} />
    <Route path="*" element={<Navigate to="/settings/most" replace />} />
  </Routes></main>
  const screensaver = pathname === '/'
  return (
    <>
      <Header />
      <VolumeModal />
      <main className={`App${screensaver ? ' is-screensaver' : ''}`}>
        <Routes>
          <Route path="/" element={<ScreenSaver />} />
          <Route path="/home" element={<Base />} />
          <Route path="/AudioDiskPlayer" element={<AudioDiskPlayerPage />} />
          <Route path="/AmFmTuner" element={<AmFmTunerPage />} />
          <Route path="/climate" element={<Climate />} />
          <Route path="/carplay" element={<Climate />} />
          <Route path="/settings" element={<SettingsHub />} />
          <Route path="/settings/audio" element={<AudioSettings />} />
          <Route path="/settings/app" element={<ApplicationSettings />} />
          <Route path="/settings/car" element={<VehicleSettings />} />
          <Route path="/settings/most" element={<MostDiagnostics />} />
          <Route path="/settings/pimost-usb" element={<PiMostUsbSettings />} />
          <Route path="/settings/most-logs" element={<MostLogViewer />} />
          <Route path="/settings/update" element={<SoftwareUpdate />} />
        </Routes>
      </main>
    </>
  )
}

export default function App() {
  const [receivingVideo, setReceivingVideo] = useState(false)
  const [settings, showSettings, setShowSettings, focus, keyCommand, commandCounter] = useCarplayStore((state) => [
    state.settings,
    state.showSettings,
    state.setShowSettings,
    state.focus,
    state.keyCommand,
    state.commandCounter
  ])
  const headUnitMode = useMostOperatingModeStore((state) => state.headUnit)
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'dark',
          primary: { main: '#67d8ff' },
          secondary: { main: '#8b9cff' },
          background: { default: '#080d14', paper: '#151e2a' },
          text: { primary: '#f4f8ff', secondary: '#8e9aaa' }
        },
        shape: { borderRadius: 16 },
        typography: { fontFamily: 'Roboto, system-ui, sans-serif' },
        components: {
          MuiButtonBase: { defaultProps: { disableRipple: true } },
          MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
          MuiDialog: {
            styleOverrides: {
              paper: {
                backgroundImage: 'linear-gradient(145deg,#1b2634,#101721)',
                border: '1px solid rgba(189,221,255,.14)'
              }
            }
          }
        }
      }),
    []
  )
  return (
    <ColorModeContext.Provider value={{ toggleColorMode: () => {} }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          {settings && headUnitMode ? (
            <Carplay
              receivingVideo={receivingVideo}
              setReceivingVideo={setReceivingVideo}
              settings={settings}
              command={keyCommand}
              commandCounter={commandCounter}
            />
          ) : null}
          {headUnitMode ? <ParkingAssistOverlay /> : null}
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}
