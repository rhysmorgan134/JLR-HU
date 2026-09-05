import { createContext, useEffect, useMemo, useState } from 'react'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { HashRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import AudioDiskPlayerPage from './components/mediaComponents/AudioDiskPlayer/AudioDiskPlayerPage'
import ScreenSaver from './components/mediaComponents/ScreenSaver'
import Header from './components/dataDisplays/Header'
import Base from './Base'
import AmFmTunerPage from './components/mediaComponents/AmFm/AmFmTunerPage'
import VolumeModal from './components/VolumeModal'
import Carplay from './components/Carplay'
import { useAudioControlStore, useCarplayStore, useHMICommandStore } from './store/store'
import Climate from './components/mediaComponents/Climate/Climate'
import AudioSettings from './components/mediaComponents/Amplifier/AudioSettings'
import { VehicleSettings } from './components/settings/VehicleSettings'
import SettingsHub from './components/settings/SettingsHub'
import SettingsPage from './components/settings/SettingsPage'
import MostDiagnostics from './components/settings/MostDiagnostics'
import MostLogViewer from './components/settings/MostLogViewer'
import ParkingAssistOverlay from './components/ParkingAssistOverlay'
import PiMostUsbSettings from './components/settings/PiMostUsbSettings'
import ApplicationSettings from './components/settings/ApplicationSettings'
import MostCcfSettings from './components/settings/MostCcfSettings'
import SoftwareUpdate from './components/settings/SoftwareUpdate'
import CarplaySettings from './components/settings/CarplaySettings'
import './App.css'

export const ColorModeContext = createContext({ toggleColorMode: () => {} })

function AppRoutes() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const hmiCommand = useHMICommandStore()
  const currentSource = useAudioControlStore((state) => state.currentSource)
  useEffect(() => {
    if (hmiCommand.action === 'navigate' && hmiCommand.path) {
      navigate(hmiCommand.path)
    } else if (hmiCommand.action === 'homeToggle') {
      if (pathname !== '/home') {
        navigate('/home')
      } else if (currentSource === 'AudioDiskPlayer') {
        navigate('/AudioDiskPlayer')
      } else if (currentSource === 'AmFmTuner') {
        navigate('/AmFmTuner')
      } else if (currentSource === 'Carplay' || currentSource === 'carplay') {
        navigate('/carplay')
      }
    } else if (hmiCommand.action === 'powerToggle') {
      navigate(pathname === '/' ? '/home' : '/')
    }
  }, [hmiCommand.nonce])
  const screensaver = pathname === '/'
  return <>
    {pathname !== '/carplay' && <Header />}
    <VolumeModal />
    <main className={`App${screensaver ? ' is-screensaver' : ''}`}>
      <Routes>
        <Route path="/" element={<ScreenSaver />} />
        <Route path="/home" element={<Base />} />
        <Route path="/AudioDiskPlayer" element={<AudioDiskPlayerPage />} />
        <Route path="/AmFmTuner" element={<AmFmTunerPage />} />
        <Route path="/climate" element={<Climate />} />
        <Route path="/carplay" element={null} />
        <Route path="/settings" element={<SettingsHub />} />
        <Route path="/settings/audio" element={<SettingsPage title="Audio settings"><AudioSettings /></SettingsPage>} />
        <Route path="/settings/app" element={<ApplicationSettings />} />
        <Route path="/settings/carplay" element={<CarplaySettings />} />
        <Route path="/settings/car" element={<SettingsPage title="Vehicle settings"><VehicleSettings /></SettingsPage>} />
        <Route path="/settings/car/ccf" element={<MostCcfSettings />} />
        <Route path="/settings/most" element={<MostDiagnostics />} />
        <Route path="/settings/most-logs" element={<MostLogViewer />} />
        <Route path="/settings/pimost-usb" element={<PiMostUsbSettings />} />
        <Route path="/settings/update" element={<SoftwareUpdate />} />
      </Routes>
    </main>
  </>
}

export default function App() {
  const [receivingVideo, setReceivingVideo] = useState(false)
  const settings = useCarplayStore((state) => state.settings)
  const command = useCarplayStore((state) => state.keyCommand)
  const commandCounter = useCarplayStore((state) => state.commandCounter)
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
  return <ColorModeContext.Provider value={{ toggleColorMode: () => {} }}><ThemeProvider theme={theme}><CssBaseline /><Router>{settings && <Carplay receivingVideo={receivingVideo} setReceivingVideo={setReceivingVideo} settings={settings} command={command} commandCounter={commandCounter} />}<ParkingAssistOverlay /><AppRoutes /></Router></ThemeProvider></ColorModeContext.Provider>
}
