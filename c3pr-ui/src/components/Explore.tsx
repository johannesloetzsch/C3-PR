import React, { useState, useEffect } from 'react'
import jsQR from 'jsqr'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowMinimize, faWindowMaximize, faWindowClose } from '@fortawesome/free-solid-svg-icons'
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

const rotate:any = {0: {'top': 'top', 'right': 'right'},
                    90: {'top': 'left', 'right': 'top'},
                    180: {'top': 'bottom', 'right': 'left'},
                    270: {'top': 'right', 'right': 'bottom'}}

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
      <iframe id='iframe' src={backgroundUrl} style={{zIndex: -100}} />
      <canvas id='canvas' />
      {/** css transform of inline elements doesn't change the bouing box of the parent :/
           To position other elements according to the boundig box, we transform the parent element and transform the other children back. **/}
      <div className={'stream ' + (minimizedStream ? "minimized" : "")} onClick={() => setMinimizedStream(!minimizedStream)} style={{transform: 'rotate(' + allocatedRobot.rotate + 'deg)'}} >
        <img id='stream' src={url_stream} />
        <FontAwesomeIcon id="stream-resize-icon" icon={minimizedStream ? faWindowMaximize : faWindowMinimize} inverse size="2x"
	                 style={{transform: 'rotate(' + -allocatedRobot.rotate + 'deg)', position: "absolute",
                                 [rotate[allocatedRobot.rotate]['top']]: "5px", [rotate[allocatedRobot.rotate]['right']]: "40px"}} />
        <FontAwesomeIcon id="stream-close-icon" icon={faWindowClose} inverse size="2x" onClick={() => document.location.assign("/")}
	                 style={{transform: 'rotate(' + -allocatedRobot.rotate + 'deg)', position: "absolute",
                                 [rotate[allocatedRobot.rotate]['top']]: "5px", [rotate[allocatedRobot.rotate]['right']]: "5px"}} />
      </div>
      <Control />
    </div>
  )
}
