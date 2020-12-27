import React from 'react'
import {url_control} from '../../conf'
import axios from 'axios'

document.addEventListener('keypress', (e) => {
  let mleft = 0;
  let mright = 0;
  if (e.key === "w") {
    mleft = 1;
    mright = 1;
  }
  if (e.key === "a") {
    mleft = -1;
    mright = 1;
  }
  if (e.key === "s") {
    mleft = 0;
    mright = 0;
  }
  if (e.key === "d") {
    mleft =  1;
    mright = -1;
  }
  if (e.key === "x") {
    mleft = -1;
    mright = -1;
  }
  axios.get(url_control + '?var=motor_both&val=' + mleft + '&val2=' + mright)
})

export default () => (
  <div>
    <img id="wasdx" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Icon_WASD.svg/200px-Icon_WASD.svg.png" />
  </div>
)
