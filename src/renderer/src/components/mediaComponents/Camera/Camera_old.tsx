import { useEffect, useRef } from 'react'

const Camera = () => {
  const videoRef = useRef(null)

  useEffect(() => {
    getVideo()
  }, [videoRef])

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        let video: HTMLVideoElement = videoRef.current!
        video.srcObject = stream
        video.play()
      })
      .catch((err) => {
        console.error('error:', err)
      })
  }

  return <video ref={videoRef} width={'70%'} />
}

export default Camera
