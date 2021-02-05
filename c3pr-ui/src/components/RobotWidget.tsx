import React from "react"
import { Robot } from '../types/Robot'
import axios from 'axios'

function allocate(robot:Robot, onSelection:any) {
  axios.post('/', 'robot=' + robot.name)
  onSelection(robot)
}

const status: any = {'offline': {'color': 'red',
                                 'msg': 'Offline',
                                 'transform': 'translate(0px, 40px) rotate(-35deg)'},
                     'used': {'color': 'yellow',
		              'msg': 'In Benutzung',
			      'transform': 'translate(-20px, 100px) rotate(-35deg)'}}

export function RobotWidget({onSelection, robot, disabled=false}:any) {
  return (
    <div style={{float: "left", maxWidth: "33%", maxHeight: "420px"}}>
      <div key={robot.name} onClick={() => {if(!disabled) allocate(robot, onSelection)}}
           style={{margin: "10px", padding: "10px", border: "solid 1px",
               opacity: disabled ? "50%" : "100%" }}>
        <h4 style={{textAlign: "center"}}> {robot.name} </h4>
        { !disabled ? "" :
          <div style={{height: "0", transform: status[disabled].transform, fontSize: "xxx-large", color: status[disabled].color}}>
            {status[disabled].msg}
          </div>
        }
        <img src={robot.img}/>
      </div>
    </div>
  )
}
