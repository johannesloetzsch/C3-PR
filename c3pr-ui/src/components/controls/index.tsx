import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdjust, faArrowUp, faArrowLeft, faArrowDown, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import {url_control} from '../../conf'
import axios from 'axios'

// light on
setInterval(() => axios.get(url_control + '?var=lamp&val=100'), 10000,)


let lastDirection:string = null
let lastKey:string = null

function handler(direction:string, e:any) {
  if(lastDirection != direction || lastKey != e.key) {
    console.log(direction, e.key)

    if(direction === 'up') {
      axios.get(url_control + '?var=motor_both&val=0&val2=0')
    } else {
      let mleft = 0;
      let mright = 0;
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
      axios.get(url_control + '?var=motor_both&val=' + mleft + '&val2=' + mright)
    }

  }
  lastDirection = direction
  lastKey = e.key
}

document.addEventListener('keydown', (e) => handler('down', e))
document.addEventListener('keyup', (e) => handler('up', e))

export default () => {
  return (
    <div id='controls'>
      <table>
        <tr>
	  <td></td>
          <td><FontAwesomeIcon icon={faArrowUp} size="3x" inverse border pull="left" onClick={null} /></td>
	  <td></td>
	  <td></td>
	  <td></td>
        </tr>
        <tr>
          <td><FontAwesomeIcon icon={faArrowLeft} size="3x" inverse border pull="left" onClick={null} /></td>
          <td><FontAwesomeIcon icon={faArrowDown} size="3x" inverse border pull="left" onClick={null} /></td>
          <td><FontAwesomeIcon icon={faArrowRight} size="3x" inverse border pull="left" onClick={null} /></td>
	  <td></td>
          <td><FontAwesomeIcon icon={faAdjust} size="3x" inverse onClick={() => console.log("light")} /></td>
        </tr>
      </table>
    </div>
  )
}
