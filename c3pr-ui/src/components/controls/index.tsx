import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdjust, faArrowUp, faArrowLeft, faArrowDown, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import {url_control, autoLogoutTime_ms, initialSpeedFallback, acceleration, steerInterval} from '../../conf'
import axios from 'axios'

let logoutTimeout: ReturnType<typeof setTimeout>

function resetLogoutTimeout() {
  clearTimeout(logoutTimeout)
  logoutTimeout = setTimeout(() => document.location.assign("/"), autoLogoutTime_ms)
}
resetLogoutTimeout()


let lastDirection:string = null
let lastKey:string = null
let mleft = 0
let mright = 0
let speed:number = null
let allocatedRobotInitialSpeed:number = null
let allocatedRobotBiasLeft:number = null

function steer() {
  let maxSpeed = Math.min( allocatedRobotBiasLeft, 1/allocatedRobotBiasLeft )
  let mleftAccelerated = Math.min(maxSpeed, speed) * mleft / allocatedRobotBiasLeft
  let mrightAccelerated = Math.min(maxSpeed, speed) * mright * allocatedRobotBiasLeft

  console.log(mleftAccelerated, mrightAccelerated)
  axios.get(url_control + '?var=motor_both&val=' + mleftAccelerated + '&val2=' + mrightAccelerated)
       .then(() => { if(mleft!=0 || mright!=0) speed += acceleration })
       .catch(() => speed = 0)
}

setInterval(() => steer(), steerInterval)

function handler(direction:string, e:any) {
  resetLogoutTimeout()

  if(lastDirection != direction || lastKey != e.key) {
    console.log(direction, e.key)

    mleft = 0
    mright = 0
    speed = allocatedRobotInitialSpeed || initialSpeedFallback

    if(direction !== 'up') {
      if (e.key === 'w' || e.key === 'ArrowUp') {
        mleft = 1;
        mright = 1;
      }
      if (e.key === 'a' || e.key === 'ArrowLeft') {
        mleft = -1;
        mright = 1;
      }
      if (e.key === 's') {
        mleft = 0;
        mright = 0;
      }
      if (e.key === 'd' || e.key === 'ArrowRight') {
        mleft =  1;
        mright = -1;
      }
      if (e.key === 'x' || e.key === 'ArrowDown') {
        mleft = -1;
        mright = -1;
      }
    }

    steer()

  }
  lastDirection = direction
  lastKey = e.key
}

document.addEventListener('keydown', (e) => handler('down', e))
document.addEventListener('keyup', (e) => handler('up', e))

function ArrowButton({Key, icon}:any) {
const key = Key
  return (
    <FontAwesomeIcon icon={icon} size="3x" inverse border pull="left" onMouseDown={()=>handler('down', {key})} onMouseUp={()=>handler('up', {key})} />
  )
}


export default ({allocatedRobot}:any) => {
  allocatedRobotInitialSpeed = allocatedRobot?.initialSpeed
  allocatedRobotBiasLeft = allocatedRobot?.biasLeft || 1

  const [lampOn, setLampOn] = useState<boolean>(false)

  function lampToggle() {
    setLampOn(!lampOn)
    axios.get(url_control + '?var=lamp&val=' + (lampOn ? '100' : '0'))
  }

  return (
    <div id='controls'>
      <table>
        <tr>
	  <td></td>
          <td><ArrowButton Key={'ArrowUp'} icon={faArrowUp} /></td>
	  <td></td>
	  <td></td>
	  <td></td>
        </tr>
        <tr>
          <td><ArrowButton Key={'ArrowLeft'} icon={faArrowLeft} /></td>
          <td><ArrowButton Key={'ArrowDown'} icon={faArrowDown} /></td>
          <td><ArrowButton Key={'ArrowRight'} icon={faArrowRight} /></td>
	  <td></td>
          <td><FontAwesomeIcon icon={faAdjust} size="3x" inverse onClick={lampToggle} /></td>
        </tr>
      </table>
    </div>
  )
}
