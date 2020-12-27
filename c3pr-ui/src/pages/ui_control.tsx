import React from 'react'
import {url_stream} from '../conf'
import Control from 'components/controls'

export default () => (
  <div>
    <img id="stream" src={url_stream} />
    <Control />
  </div>
)
