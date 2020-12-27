import React from 'react'
import {url_stream, qr_interval, qr_args, iframe_origin /*, debug*/} from '../conf'
import jsQR from 'jsqr'
import Control from 'components/controls'

function tick() {
  const stream = document.getElementById('stream') as HTMLImageElement
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const context = canvas.getContext('2d')

  canvas.hidden = true //!debug
  canvas.height = stream.height
  canvas.width = stream.width
  context.drawImage(stream, 0, 0)

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
  const code = jsQR(imageData.data, imageData.width, imageData.height, qr_args)

  if(code)
    console.log(code.data)
    if(code.data.startsWith("http")) {
      const iframe = document.getElementById("iframe") as HTMLIFrameElement
      iframe.src = code.data
    }
}

setInterval(tick, qr_interval)

export default () => (
  <div>
    <iframe id="iframe" src={iframe_origin} />
    <img id="stream" src={url_stream} style={{transform: "rotate(90deg)"}} />
    <canvas id="canvas" />
    <Control />
  </div>
)
