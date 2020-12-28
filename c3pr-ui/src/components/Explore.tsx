import React, { useState, useEffect } from 'react'
import jsQR from 'jsqr'
import {url_stream, qr_interval, qr_args, iframe_origin, debug} from '../conf'
import { Robot } from '../types/Robot'
import Control from './controls'

function evaluateQR() {
  const stream = document.getElementById('stream') as HTMLImageElement
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const context = canvas.getContext('2d')

  canvas.hidden = !debug
  canvas.height = stream.height
  canvas.width = stream.width
  context.drawImage(stream, 0, 0)

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
  const code = jsQR(imageData.data, imageData.width, imageData.height, qr_args)

  if(code) {
    console.log('QRcode:' ,code.data)
    if(code.data.startsWith("http")) {
      return code.data
    }
  }
}

function reloadStream() {
  const stream = document.getElementById('stream') as HTMLImageElement
  const waitingTimePerAttempt_ms = 5*1000
  const pseudoRandom = Math.floor( (new Date().getTime()) / waitingTimePerAttempt_ms )
  const newUrl = url_stream + "?" + pseudoRandom + "/stream"
  if(!stream.src.endsWith(newUrl)) {
    console.log("reconnect Stream")
    stream.src = newUrl
  }
}

interface ExploreProps {
  allocatedRobot: Robot
}

export default ({allocatedRobot}:ExploreProps) => {
  const [backgroundUrl, setBackgroundUrl] = useState<string>(iframe_origin)
  const [minimizedStream, setMinimizedStream] = useState<boolean>(false)

  useEffect(() => {
    const interval = setInterval(() => {
      let qr = null
      try { qr = evaluateQR() }
      catch (e) { reloadStream() }

      if(qr && qr != backgroundUrl) {
        setBackgroundUrl(qr)
	setMinimizedStream(true)
      }
    }, qr_interval);
    return () => clearInterval(interval);
  }, []);


  return (
    <div>
      {allocatedRobot && console.log('connected to:', allocatedRobot.name, allocatedRobot)}
      <iframe id="iframe" src={backgroundUrl} style={{zIndex: -100}} />
      <img id="stream" src={url_stream}
	   style={{transform: 'rotate(' + allocatedRobot.rotate + 'deg)'}}
           className={minimizedStream ? "minimized" : ""}
	   onClick={() => setMinimizedStream(!minimizedStream)} />
      <canvas id="canvas" style={{zIndex: 100}} />
      <Control />
    </div>
  )
}
