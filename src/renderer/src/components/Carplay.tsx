import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { RotatingLines } from 'react-loader-spinner'
import { findDevice, requestDevice, CommandMapping } from 'node-carplay/web'
import { CarPlayWorker, KeyCommand } from './worker/types'
import useCarplayAudio from './useCarplayAudio'
import { useCarplayTouch } from './useCarplayTouch'
import { useLocation, useNavigate } from 'react-router-dom'
import { ExtraConfig } from '../../../main/Globals'
import { useCarplayStore } from '../store/store'
import { InitEvent } from './worker/render/RenderEvents'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import { Box, Button, IconButton, Typography } from '@mui/material'

const width = window.innerWidth
const height = window.innerHeight

const videoChannel = new MessageChannel()
const micChannel = new MessageChannel()

const RETRY_DELAY_MS = 15000

interface CarplayProps {
  receivingVideo: boolean
  setReceivingVideo: (receivingVideo: boolean) => void
  settings: ExtraConfig
  command: KeyCommand | ''
  commandCounter: number
}

function Carplay({
  receivingVideo,
  setReceivingVideo,
  settings,
  command,
  commandCounter
}: CarplayProps) {
  const [isPlugged, setPlugged] = useState(false)
  const [deviceFound, setDeviceFound] = useState(false)
  const [connectionTimedOut, setConnectionTimedOut] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null)
  const mainElem = useRef<HTMLDivElement>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  void receivingVideo
  const [stream, playing, setFocus, setStorePlugged, setMedia, clearMedia] = useCarplayStore((state) => [
    state.stream,
    state.playing,
    state.setFocus,
    state.setPlugged,
    state.setMedia,
    state.clearMedia
  ])
  const config = {
    fps: settings.fps,
    width: width,
    height: height - 28,
    mediaDelay: settings.mediaDelay
  }
  // const pathname = "/"
  console.log(pathname)

  const renderWorker = useMemo(() => {
    if (!canvasElement) return

    const worker = new Worker(new URL('./worker/render/Render.worker.ts', import.meta.url), {
      type: 'module'
    })
    const canvas = canvasElement.transferControlToOffscreen()
    worker.postMessage(new InitEvent(canvas, videoChannel.port2), [canvas, videoChannel.port2])
    return worker
  }, [canvasElement])

  useLayoutEffect(() => {
    if (canvasRef.current) {
      setCanvasElement(canvasRef.current)
    }
  }, [])

  const carplayWorker = useMemo(() => {
    const worker = new Worker(new URL('./worker/CarPlay.worker.ts', import.meta.url), {
      type: 'module'
    }) as CarPlayWorker
    const payload = {
      videoPort: videoChannel.port1,
      microphonePort: micChannel.port1
    }
    worker.postMessage({ type: 'initialise', payload }, [videoChannel.port1, micChannel.port1])
    return worker
  }, [])

  const { processAudio, getAudioPlayer, startRecording, stopRecording } = useCarplayAudio(
    carplayWorker,
    micChannel.port2
  )

  const clearRetryTimeout = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }
  }, [])

  // subscribe to worker messages
  useEffect(() => {
    carplayWorker.onmessage = (ev) => {
      const { type } = ev.data
      switch (type) {
        case 'plugged':
          setConnectionTimedOut(false)
          setPlugged(true)
          setStorePlugged(true)
          if (settings.piMost && settings?.most?.stream) {
            console.log('setting most stream')
            stream(settings.most.stream)
          }
          break
        case 'unplugged':
          setPlugged(false)
          setStorePlugged(false)
          clearMedia()
          setConnectionTimedOut(false)
          break
        case 'requestBuffer':
          clearRetryTimeout()
          getAudioPlayer(ev.data.message)
          break
        case 'audio':
          clearRetryTimeout()
          processAudio(ev.data.message)
          break
        case 'media':
          if (ev.data.message.payload?.type === 1) {
            const media = ev.data.message.payload.media
            const update: Parameters<typeof setMedia>[0] = {}
            if ('MediaSongName' in media)
              update.mediaSongName = media.MediaSongName?.trim() || null
            if ('MediaAlbumName' in media)
              update.mediaAlbumName = media.MediaAlbumName?.trim() || null
            if ('MediaArtistName' in media)
              update.mediaArtistName = media.MediaArtistName?.trim() || null
            if ('MediaAPPName' in media)
              update.mediaAppName = media.MediaAPPName?.trim() || null
            if (Object.keys(update).length > 0) setMedia(update)
          } else if (ev.data.message.payload?.type === 3) {
            setMedia({ mediaAlbumCover: ev.data.message.payload.base64Image || null })
          }
          break
        case 'command':
          const {
            message: { value }
          } = ev.data
          switch (value) {
            case CommandMapping.startRecordAudio:
              startRecording()
              break
            case CommandMapping.stopRecordAudio:
              stopRecording()
              break
            case CommandMapping.requestHostUI:
              navigate('/home')
          }
          break
        case 'failure':
          if (retryTimeoutRef.current == null) {
            console.error(`Carplay initialization failed -- Reloading page in ${RETRY_DELAY_MS}ms`)
            retryTimeoutRef.current = setTimeout(() => {
              window.location.reload()
            }, RETRY_DELAY_MS)
          }
          break
      }
    }
  }, [
    carplayWorker,
    clearRetryTimeout,
    getAudioPlayer,
    processAudio,
    renderWorker,
    clearMedia,
    setMedia,
    setStorePlugged,
    startRecording,
    stopRecording
  ])

  useEffect(() => {
    const element = mainElem?.current
    if (!element) return
    const observer = new ResizeObserver(() => {
      console.log('size change')
      carplayWorker.postMessage({ type: 'frame' })
    })
    observer.observe(element)
    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (pathname === '/carplay' && playing) {
      setFocus(true)
    } else {
      setFocus(false)
    }
  }, [pathname, playing])

  useEffect(() => {
    if (command) carplayWorker.postMessage({ type: 'keyCommand', command })
  }, [commandCounter])

  const checkDevice = useCallback(
    async (request: boolean = false) => {
      const device = request ? await requestDevice() : await findDevice()
      if (device) {
        console.log('starting in check')
        setDeviceFound(true)
        setReceivingVideo(true)
        carplayWorker.postMessage({ type: 'start', payload: { config } })
      } else {
        console.log('device not found')
        setDeviceFound(false)
      }
    },
    [carplayWorker]
  )

  // usb connect/disconnect handling and device check
  useEffect(() => {
    navigator.usb.onconnect = async () => {
      checkDevice()
    }

    navigator.usb.ondisconnect = async () => {
      const device = await findDevice()
      if (!device) {
        carplayWorker.postMessage({ type: 'stop' })
        setDeviceFound(false)
      }
    }

    checkDevice()
  }, [carplayWorker, checkDevice])

  useEffect(() => {
    if (!deviceFound || isPlugged) {
      setConnectionTimedOut(false)
      return
    }
    const timeout = setTimeout(() => setConnectionTimedOut(true), 10000)
    return () => clearTimeout(timeout)
  }, [deviceFound, isPlugged])

  const onClick = useCallback(() => {
    checkDevice(true)
  }, [checkDevice])

  const retryConnection = useCallback(() => {
    setConnectionTimedOut(false)
    carplayWorker.postMessage({ type: 'stop' })
    setTimeout(() => checkDevice(), 250)
  }, [carplayWorker, checkDevice])

  const sendTouchEvent = useCarplayTouch(carplayWorker, width, height)

  const isLoading = !isPlugged

  return (
    <div
      style={pathname === '/carplay' ? { touchAction: 'none' } : { display: 'none' }}
      className={pathname === '/carplay' ? (playing ? 'noNavView' : 'mainView') : ''}
      ref={mainElem}
    >
      {(deviceFound === false || isLoading) && pathname === '/carplay' && (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'radial-gradient(circle at center, #172433 0%, #070c13 72%)',
            zIndex: 4
          }}
        >
          <IconButton aria-label="Return home" onClick={() => navigate('/home')} sx={{ position: 'absolute', top: 16, left: 16, color: 'white', background: 'rgba(255,255,255,.08)' }}><ArrowBackRoundedIcon /></IconButton>
          {deviceFound === false && (
            <Box sx={{ textAlign: 'center' }}><Typography sx={{ mb: 2, color: 'text.secondary' }}>CarPlay dongle not detected</Typography><Button variant="contained" onClick={onClick}>Connect CarPlay</Button></Box>
          )}
          {deviceFound && !connectionTimedOut && (
            <Box sx={{ textAlign: 'center' }}><RotatingLines strokeColor="#67d8ff" strokeWidth="4" animationDuration="0.75" width="72" visible /><Typography sx={{ mt: 2, color: 'text.secondary' }}>Connecting to CarPlay…</Typography><Button sx={{ mt: 1 }} onClick={() => navigate('/home')}>Return home</Button></Box>
          )}
          {deviceFound && connectionTimedOut && (
            <Box sx={{ textAlign: 'center', maxWidth: 330 }}><Typography sx={{ fontSize: 22, fontWeight: 600 }}>CarPlay is taking longer than expected</Typography><Typography sx={{ mt: 1, color: 'text.secondary' }}>The dongle is connected, but the phone has not rejoined.</Typography><Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}><Button variant="contained" onClick={retryConnection}>Try again</Button><Button variant="outlined" onClick={() => navigate('/home')}>Home</Button></Box></Box>
          )}
        </div>
      )}
      <div
        id="videoContainer"
        onPointerDown={sendTouchEvent}
        onPointerMove={sendTouchEvent}
        onPointerUp={sendTouchEvent}
        onPointerCancel={sendTouchEvent}
        onPointerOut={sendTouchEvent}
        style={{
          height: '100%',
          width: '100%',
          padding: 0,
          margin: 0,
          display: 'flex'
        }}
      >
        <canvas
          ref={canvasRef}
          id={'video'}
          style={isPlugged ? { height: '100%', width: '100%', overflow: 'hidden' } : undefined}
        />
      </div>
    </div>
  )
}

export default React.memo(Carplay)
