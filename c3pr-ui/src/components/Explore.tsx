import React from 'react'
import jsQR from 'jsqr'
import {url_stream, qr_interval, qr_args, iframe_origin /*, debug*/} from '../conf'
import { Robot } from '../types/Robot'
import Control from './controls'

function tick() {
  const stream = document.getElementById('stream') as HTMLImageElement
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  if(!canvas) return
  const context = canvas.getContext('2d')

  canvas.hidden = true //!debug
  canvas.height = stream.height
  canvas.width = stream.width
  context.drawImage(stream, 0, 0)

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
  const code = jsQR(imageData.data, imageData.width, imageData.height, qr_args)

  if(code) {
    console.log('QRcode:' ,code.data)
    if(code.data.startsWith("http")) {
      const iframe = document.getElementById("iframe") as HTMLIFrameElement
      iframe.src = code.data
    }
  }
}

setInterval(tick, qr_interval)

interface ExploreProps {
  allocatedRobot: Robot
}

export default ({allocatedRobot}:ExploreProps) => (
  <div>
    {allocatedRobot && console.log('connected to:', allocatedRobot.name, allocatedRobot)}
    <iframe id="iframe" src={iframe_origin} />
    <img id="stream" src={url_stream} style={{transform: 'rotate(' + allocatedRobot.rotate + 'deg)'}} />
    <canvas id="canvas" />
    <Control />
  </div>
)
